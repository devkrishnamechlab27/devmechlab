"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type Internship = {
  id: number;
  title: string;
  slug: string;
  price: string;
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function InternshipPaymentButton({
  internship,
}: {
  internship: Internship;
}) {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Please login first.");
        return;
      }

      /*
       * CHECK EXISTING ENROLLMENT
       */

      const { data: existingEnrollment } = await supabase
        .from("internship_enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("internship_id", internship.id)
        .maybeSingle();

      if (existingEnrollment) {
        alert("You are already enrolled in this internship.");
        return;
      }

      /*
       * FREE INTERNSHIP
       */

      const amount = Number(
        internship.price.replace(/[^\d]/g, "")
      );

      if (internship.price.toUpperCase() === "FREE" || amount === 0) {
        const { error } = await supabase
          .from("internship_enrollments")
          .insert({
            user_id: user.id,
            internship_id: internship.id,
            program_name: internship.title,
            status: "ENROLLED",
          });

        if (error) {
          console.error(
            "FREE INTERNSHIP ENROLLMENT ERROR:",
            error
          );

          alert("Enrollment failed.");
          return;
        }

        alert("Successfully enrolled!");

        window.location.href = "/dashboard/internships";
        return;
      }

      /*
       * PAID INTERNSHIP
       */

      console.log("Internship:", internship.title);
      console.log("Internship ID:", internship.id);
      console.log("Internship Price:", internship.price);
      console.log("Payment Amount:", amount);

      /*
       * CREATE RAZORPAY ORDER
       */

      const orderResponse = await fetch(
        "/api/razorpay/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
          }),
        }
      );

      if (!orderResponse.ok) {
        throw new Error(
          "Failed to create Razorpay order"
        );
      }

      const order = await orderResponse.json();

      /*
       * LOAD RAZORPAY CHECKOUT
       */

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        const options = {
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount: order.amount,

          currency: order.currency,

          name: "DevMechLab",

          description: internship.title,

          order_id: order.id,

          handler: async function (response: any) {
            try {
              const verifyResponse =
                await fetch(
                  "/api/razorpay/verify",
                  {
                    method: "POST",
                    credentials: "include",
                    headers: {
                      "Content-Type":
                        "application/json",
                    },
                    body: JSON.stringify({
                      ...response,
                      internshipId:
                        internship.id,
                      amount,
                      userId: user.id,
                    }),
                  }
                );

              const result =
                await verifyResponse.json();

              if (!result.success) {
                alert(
                  "Payment verification failed."
                );
                return;
              }

              alert(
                "Payment successful! You are now enrolled."
              );

              window.location.href =
                "/dashboard/internships";
            } catch (error) {
              console.error(
                "INTERNSHIP PAYMENT VERIFICATION ERROR:",
                error
              );

              alert(
                "Payment verification failed."
              );
            }
          },

          theme: {
            color: "#2563eb",
          },
        };

        const paymentObject =
          new window.Razorpay(options);

        paymentObject.open();
      };

      script.onerror = () => {
        alert(
          "Unable to load Razorpay checkout."
        );
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error(
        "INTERNSHIP PAYMENT ERROR:",
        error
      );

      alert("Payment failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl text-xl font-bold transition"
    >
      {loading
        ? "Processing..."
        : internship.price.toUpperCase() === "FREE"
        ? "Enroll Now"
        : "Proceed to Payment"}
    </button>
  );
}
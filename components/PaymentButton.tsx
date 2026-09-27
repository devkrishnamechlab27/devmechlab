"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Course = {
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

export default function PaymentButton({
  course,
}: {
  course: Course;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    try {
      setLoading(true);

      /*
       * CHECK LOGIN
       */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      /*
       * COURSE PRICE
       */
      const amount = Number(
        course.price.replace(/[^\d]/g, "")
      );

      console.log("Course Price:", course.price);
      console.log("Amount:", amount);

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
        console.error(
          "ORDER CREATION FAILED:",
          orderResponse.status
        );

        alert("Unable to create payment order.");
        return;
      }

      const order = await orderResponse.json();

      console.log("RAZORPAY ORDER:", order);

      /*
       * LOAD RAZORPAY
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

          description: course.title,

          order_id: order.id,

          handler: async function (
            response: any
          ) {
            try {
              /*
               * VERIFY PAYMENT
               */
              const verify = await fetch(
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

                    courseId: course.id,

                    amount,

                    userId: user.id,
                  }),
                }
              );

              const result =
                await verify.json();

              console.log(
                "PAYMENT VERIFICATION RESULT:",
                result
              );

              /*
               * PAYMENT FAILED
               */
              if (!verify.ok || !result.success) {
                alert(
                  result.message ||
                    "Payment Verification Failed"
                );

                return;
              }

              /*
               * PAYMENT + ENROLLMENT SUCCESS
               */
              alert(
                "Payment Verified Successfully! You are now enrolled."
              );

              /*
               * GO TO MY COURSES
               */
              router.replace(
                "/dashboard/my-courses"
              );

              router.refresh();
            } catch (error) {
              console.error(
                "PAYMENT VERIFICATION ERROR:",
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
        console.error(
          "RAZORPAY SCRIPT FAILED TO LOAD"
        );

        alert(
          "Unable to load payment system. Please try again."
        );
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error(
        "PAYMENT ERROR:",
        err
      );

      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading
        ? "Loading..."
        : "Proceed to Payment"}
    </button>
  );
}
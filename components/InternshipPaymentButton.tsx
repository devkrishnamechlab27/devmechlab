"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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
        /*
         * Preserve the internship checkout destination.
         *
         * Example:
         *
         * /login?redirect=%2Finternship-checkout%2Fmechanical-engineering
         */

        const loginUrl =
          `/login?redirect=${encodeURIComponent(
            `/internship-checkout/${internship.slug}`
          )}`;

        console.log(
          "INTERNSHIP NOT LOGGED IN → REDIRECTING TO:",
          loginUrl
        );

        router.push(loginUrl);
        return;
      }

      console.log(
        "INTERNSHIP PAYMENT USER:",
        user.id
      );

      /*
       * CHECK EXISTING ENROLLMENT
       */

      const {
        data: existingEnrollment,
        error: enrollmentError,
      } = await supabase
        .from("internship_enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq(
          "internship_id",
          internship.id
        )
        .maybeSingle();

      if (enrollmentError) {
        console.error(
          "INTERNSHIP ENROLLMENT CHECK ERROR:",
          enrollmentError
        );

        alert(
          "Unable to check your internship enrollment."
        );

        return;
      }

      /*
       * ALREADY ENROLLED
       */

      if (existingEnrollment) {
        console.log(
          "INTERNSHIP ALREADY ENROLLED"
        );

        router.replace(
          "/dashboard/internships"
        );

        return;
      }

      /*
       * CALCULATE PRICE
       */

      const priceString =
        String(internship.price)
          .trim()
          .toUpperCase();

      const amount =
        Number(
          internship.price.replace(
            /[^\d]/g,
            ""
          )
        );

      console.log(
        "INTERNSHIP PRICE:",
        internship.price
      );

      console.log(
        "INTERNSHIP AMOUNT:",
        amount
      );

      /*
       * FREE INTERNSHIP
       */

      if (
        priceString === "FREE" ||
        amount === 0
      ) {
        const {
          error: freeEnrollmentError,
        } = await supabase
          .from(
            "internship_enrollments"
          )
          .insert({
            user_id: user.id,
            internship_id:
              internship.id,
            program_name:
              internship.title,
            status: "ENROLLED",
          });

        if (freeEnrollmentError) {
          console.error(
            "FREE INTERNSHIP ENROLLMENT ERROR:",
            freeEnrollmentError
          );

          alert(
            "Enrollment failed."
          );

          return;
        }

        alert(
          "Successfully enrolled!"
        );

        router.replace(
          "/dashboard/internships"
        );

        router.refresh();

        return;
      }

      /*
       * PAID INTERNSHIP
       */

      console.log(
        "PAID INTERNSHIP → CREATING RAZORPAY ORDER"
      );

      /*
       * CREATE RAZORPAY ORDER
       */

      const orderResponse =
        await fetch(
          "/api/razorpay/order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              amount,
            }),
          }
        );

      if (!orderResponse.ok) {
        console.error(
          "INTERNSHIP ORDER CREATION FAILED:",
          orderResponse.status
        );

        alert(
          "Unable to create payment order."
        );

        return;
      }

      const order =
        await orderResponse.json();

      console.log(
        "INTERNSHIP RAZORPAY ORDER:",
        order
      );

      /*
       * LOAD RAZORPAY
       */

      const script =
        document.createElement(
          "script"
        );

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        const options = {
          key:
            process.env
              .NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount:
            order.amount,

          currency:
            order.currency,

          name: "DevMechLab",

          description:
            internship.title,

          order_id:
            order.id,

          handler:
            async function (
              response: any
            ) {
              try {
                /*
                 * VERIFY PAYMENT
                 */

                const verifyResponse =
                  await fetch(
                    "/api/razorpay/verify",
                    {
                      method: "POST",

                      credentials:
                        "include",

                      headers: {
                        "Content-Type":
                          "application/json",
                      },

                      body: JSON.stringify({
                        ...response,

                        internshipId:
                          internship.id,

                        amount,

                        userId:
                          user.id,
                      }),
                    }
                  );

                const result =
                  await verifyResponse.json();

                console.log(
                  "INTERNSHIP PAYMENT VERIFICATION RESULT:",
                  result
                );

                /*
                 * PAYMENT FAILED
                 */

                if (
                  !verifyResponse.ok ||
                  !result.success
                ) {
                  alert(
                    result.message ||
                      "Payment verification failed."
                  );

                  return;
                }

                /*
                 * PAYMENT SUCCESS
                 */

                alert(
                  "Payment successful! You are now enrolled."
                );

                /*
                 * GO TO MY INTERNSHIPS
                 */

                router.replace(
                  "/dashboard/internships"
                );

                router.refresh();
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
          new window.Razorpay(
            options
          );

        paymentObject.open();
      };

      script.onerror = () => {
        console.error(
          "RAZORPAY SCRIPT FAILED TO LOAD"
        );

        alert(
          "Unable to load Razorpay checkout. Please try again."
        );
      };

      document.body.appendChild(
        script
      );
    } catch (error) {
      console.error(
        "INTERNSHIP PAYMENT ERROR:",
        error
      );

      alert(
        "Payment failed."
      );
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
        : String(
            internship.price
          )
            .trim()
            .toUpperCase() ===
          "FREE"
        ? "Enroll Now"
        : "Proceed to Payment"}
    </button>
  );
}
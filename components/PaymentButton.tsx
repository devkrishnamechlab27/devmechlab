"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
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
      const amount = Number(course.price.replace(/[^\d]/g, ""));

console.log("Course Price:", course.price);
console.log("Amount:", amount);

const payload = {
  amount,
};

console.log("Sending payload:", payload);

const orderResponse = await fetch("/api/razorpay/order", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(payload),
});

      const order = await orderResponse.json();

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

          amount: order.amount,

          currency: order.currency,

          name: "DevMechLab",

          description: course.title,

          order_id: order.id,

          handler: async function (response: any) {

  const verify = await fetch("/api/razorpay/verify", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  ...response,
  courseId: course.id,
  amount,
  userId: user.id,
}),

  });

  const result = await verify.json();

  if (!result.success) {
    alert("Payment Verification Failed");
    return;
  }

  alert("Payment Verified Successfully!");
},

          theme: {
            color: "#2563eb",
          },
        };

        const paymentObject = new window.Razorpay(options);

        paymentObject.open();
      };

      document.body.appendChild(script);
    } catch (err) {
      console.error(err);
      alert("Payment Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-xl font-bold"
    >
      {loading ? "Loading..." : "Proceed to Payment"}
    </button>
  );
}
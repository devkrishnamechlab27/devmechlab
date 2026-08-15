import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

console.log("Received body:", body);

const amount = Number(body.amount);

console.log("Parsed amount:", amount);
    const order = await razorpay.orders.create({
      amount: amount * 100, // convert ₹ to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return NextResponse.json(order);
  }
        
  
  catch (error) {
    console.error("Razorpay Order Error:", error);

    return NextResponse.json(
      { error: "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
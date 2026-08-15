import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      amount,
    } = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: "Invalid Signature" },
        { status: 400 }
      );
    }

    

const { userId } = body;
console.log("User ID:", userId);
console.log("Service key loaded:",!!process.env.SUPABASE_SERVICE_ROLE_KEY);

if (!userId) {
  return NextResponse.json(
    {
      success: false,
      message: "User ID missing",
    },
    { status: 401 }
  );
}

   const { error: paymentError } = await supabaseAdmin
  .from("payments")
  .insert({
    user_id: userId,
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
    amount,
    status: "SUCCESS",
  });

if (paymentError) {
  console.error("Payment Insert Error:", paymentError);

  return NextResponse.json(
    {
      success: false,
      message: paymentError.message,
    },
    { status: 500 }
  );
}

    // Prevent duplicate enrollment
    const { data: existingEnrollment } = await supabaseAdmin
      .from("enrollments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (!existingEnrollment) {
      const { error: enrollError } = await supabaseAdmin
  .from("enrollments")
  .insert({
    user_id: userId,
    course_id: courseId,
    progress: 0,
    completed: false,
  });

if (enrollError) {
  console.error("Enrollment Error:", enrollError);

  return NextResponse.json(
    {
      success: false,
      message: enrollError.message,
    },
    { status: 500 }
  );
}
    }

    return NextResponse.json({
      success: true,
      message: "Payment Verified",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Verification Failed",
      },
      { status: 500 }
    );
  }
}
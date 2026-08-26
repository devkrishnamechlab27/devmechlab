import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

const {
  data: { user },
  error: authError,
} = await supabase.auth.getUser();

if (authError || !user) {
  return NextResponse.json(
    {
      success: false,
      message: "Unauthorized",
    },
    { status: 401 }
  );
}
    const body = await req.json();

    const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  courseId,
  internshipId,
  amount,
} = body;

    /*
     * BASIC VALIDATION
     */

    if (
  !razorpay_order_id ||
  !razorpay_payment_id ||
  !razorpay_signature

    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Required payment information missing.",
        },
        { status: 400 }
      );
    }
      const userId = user.id;
    /*
     * RAZORPAY SIGNATURE VERIFICATION
     */

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET!
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (
      generatedSignature !== razorpay_signature
    ) {
      console.error(
        "INVALID RAZORPAY PAYMENT SIGNATURE"
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid Signature",
        },
        { status: 400 }
      );
    }

    /*
     * MAKE SURE THIS IS EITHER:
     *
     * COURSE PAYMENT
     * OR
     * INTERNSHIP PAYMENT
     */

    if (!courseId && !internshipId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Course ID or Internship ID is required.",
        },
        { status: 400 }
      );
    }

    if (courseId && internshipId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment cannot contain both course and internship.",
        },
        { status: 400 }
      );
    }

    /*
     * RECORD SUCCESSFUL PAYMENT
     */

    const { error: paymentError } =
      await supabaseAdmin
        .from("payments")
        .insert({
          user_id: userId,
          order_id: razorpay_order_id,
          payment_id: razorpay_payment_id,
          amount,
          status: "SUCCESS",
        });

    if (paymentError) {
      console.error(
        "Payment Insert Error:",
        paymentError
      );

      return NextResponse.json(
        {
          success: false,
          message: paymentError.message,
        },
        { status: 500 }
      );
    }

    /*
     * COURSE PAYMENT
     */

    if (courseId) {
      console.log(
        "PROCESSING COURSE PAYMENT:",
        {
          userId,
          courseId,
          amount,
        }
      );

      /*
       * PREVENT DUPLICATE COURSE ENROLLMENT
       */

      const {
        data: existingEnrollment,
      } = await supabaseAdmin
        .from("enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .maybeSingle();

      if (!existingEnrollment) {
        const {
          error: enrollError,
        } = await supabaseAdmin
          .from("enrollments")
          .insert({
            user_id: userId,
            course_id: courseId,
            progress: 0,
            completed: false,
          });

        if (enrollError) {
          console.error(
            "Enrollment Error:",
            enrollError
          );

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
        message:
          "Course payment verified successfully.",
      });
    }

    /*
     * INTERNSHIP PAYMENT
     */

    if (internshipId) {
      console.log(
        "PROCESSING INTERNSHIP PAYMENT:",
        {
          userId,
          internshipId,
          amount,
        }
      );

      /*
       * GET INTERNSHIP
       *
       * We fetch the title from the database
       * instead of trusting the browser.
       */

      const {
        data: internship,
        error: internshipError,
      } = await supabaseAdmin
        .from("internships")
        .select("id, title, price")
        .eq("id", internshipId)
        .single();

      if (
        internshipError ||
        !internship
      ) {
        console.error(
          "INTERNSHIP LOOKUP ERROR:",
          internshipError
        );

        return NextResponse.json(
          {
            success: false,
            message: "Internship not found.",
          },
          { status: 404 }
        );
      }

      /*
       * PREVENT DUPLICATE INTERNSHIP ENROLLMENT
       */

      const {
        data: existingInternshipEnrollment,
      } = await supabaseAdmin
        .from("internship_enrollments")
        .select("id")
        .eq("user_id", userId)
        .eq(
          "internship_id",
          internshipId
        )
        .maybeSingle();

      if (
        !existingInternshipEnrollment
      ) {
        const {
          error: internshipEnrollmentError,
        } = await supabaseAdmin
          .from("internship_enrollments")
          .insert({
            user_id: userId,
            internship_id: internship.id,
            program_name: internship.title,
            status: "ENROLLED",
          });

        if (
          internshipEnrollmentError
        ) {
          console.error(
            "INTERNSHIP ENROLLMENT ERROR:",
            internshipEnrollmentError
          );

          return NextResponse.json(
            {
              success: false,
              message:
                internshipEnrollmentError.message,
            },
            { status: 500 }
          );
        }
      }

      return NextResponse.json({
        success: true,
        message:
          "Internship payment verified successfully.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to determine payment type.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error(
      "RAZORPAY VERIFICATION ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Verification Failed",
      },
      { status: 500 }
    );
  }
}
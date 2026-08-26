import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    /*
     * 1. GET AUTHENTICATED SERVER SESSION
     */

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    /*
     * 2. VERIFY ADMIN ROLE
     *
     * This is checked on the server.
     * We do NOT trust the browser to tell us
     * whether the user is an admin.
     */

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (
      profileError ||
      profile?.role !== "admin"
    ) {
      console.error(
        "ADMIN REVIEW ACCESS DENIED:",
        {
          userId: user.id,
          profileError,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    /*
     * 3. READ REQUEST BODY
     */

    const body = await req.json();

    const {
      submissionId,
      status,
      remarks,
    } = body;

    /*
     * 4. VALIDATE INPUT
     */

    if (!submissionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Submission ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      status !== "APPROVED" &&
      status !== "REVISION_REQUIRED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid review status.",
        },
        { status: 400 }
      );
    }

    /*
     * 5. UPDATE SUBMISSION
     *
     * Service-role client is used only on the
     * server after admin authorization.
     */

    const { data: existingSubmission, error: submissionError } = await supabaseAdmin
    .from("internship_project_submissions")
    .select("id, user_id, internship_id, project_id")
    .eq("id", submissionId)
    .single();

if (submissionError || !existingSubmission) {
  console.error(
    "SUBMISSION LOOKUP ERROR:",
    submissionError
  );

  return NextResponse.json(
    {
      success: false,
      message: "Project submission not found.",
    },
    { status: 404 }
  );
}

const {
  data: updatedSubmission,
  error: updateError,
} = await supabaseAdmin
  .from("internship_project_submissions")
  .update({
    status,
    remarks:
      typeof remarks === "string"
        ? remarks.trim() || null
        : null,
  })
  .eq("id", existingSubmission.id)
  .select(
    "id, status, remarks, submitted_at"
  )
  .single();

    /*
     * 6. SUCCESS
     */

    return NextResponse.json({
      success: true,
      message:
        status === "APPROVED"
          ? "Project approved successfully."
          : "Revision requested successfully.",
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error(
      "ADMIN PROJECT REVIEW ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Review operation failed.",
      },
      { status: 500 }
    );
  }
}
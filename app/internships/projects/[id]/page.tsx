"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Project = {
  id: number;
  internship_id: number;
  project_number: number;
  title: string;
  description: string | null;
  instructions: string | null;
  resources: string[] | null;
};

type Internship = {
  id: number;
  slug: string;
  title: string;
};

type Submission = {
  id: number;
  submission_url: string | null;
  submission_text: string | null;
  status: string;
  remarks: string | null;
  submitted_at: string | null;
};

export default function InternshipProjectPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [project, setProject] = useState<Project | null>(null);
  const [internship, setInternship] =
    useState<Internship | null>(null);

  const [submission, setSubmission] =
    useState<Submission | null>(null);

  const [submissionUrl, setSubmissionUrl] =
    useState("");

  const [submissionText, setSubmissionText] =
    useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        /*
         * 1. LOAD PROJECT
         */

        const {
          data: projectData,
          error: projectError,
        } = await supabase
          .from("internship_projects")
          .select("*")
          .eq("id", projectId)
          .single();

        if (projectError || !projectData) {
          console.error(
            "PROJECT LOAD ERROR:",
            projectError
          );

          router.push("/dashboard/internships");
          return;
        }

        /*
         * 2. LOAD INTERNSHIP
         */

        const {
          data: internshipData,
          error: internshipError,
        } = await supabase
          .from("internships")
          .select("id, slug, title")
          .eq(
            "id",
            projectData.internship_id
          )
          .single();

        if (internshipError || !internshipData) {
          console.error(
            "INTERNSHIP LOAD ERROR:",
            internshipError
          );

          router.push("/dashboard/internships");
          return;
        }

        /*
         * 3. VERIFY ENROLLMENT
         */

        const {
          data: enrollment,
          error: enrollmentError,
        } = await supabase
          .from("internship_enrollments")
          .select("id")
          .eq(
            "user_id",
            session.user.id
          )
          .eq(
            "internship_id",
            projectData.internship_id
          )
          .maybeSingle();

        if (enrollmentError) {
          console.error(
            "PROJECT ENROLLMENT CHECK ERROR:",
            enrollmentError
          );

          router.push("/dashboard/internships");
          return;
        }

        if (!enrollment) {
          alert(
            "You are not enrolled in this internship."
          );

          router.push("/dashboard/internships");
          return;
        }

        /*
         * 4. LOAD EXISTING SUBMISSION
         */

        const {
          data: submissionData,
          error: submissionError,
        } = await supabase
          .from("internship_project_submissions")
          .select(
            `
              id,
              submission_url,
              submission_text,
              status,
              remarks,
              submitted_at
            `
          )
          .eq(
            "user_id",
            session.user.id
          )
          .eq(
            "internship_id",
            projectData.internship_id
          )
          .eq(
            "project_id",
            projectData.id
          )
          .maybeSingle();

        if (submissionError) {
          console.error(
            "PROJECT SUBMISSION LOAD ERROR:",
            submissionError
          );
        }

        /*
         * 5. SAVE DATA
         */

        setProject(projectData);
        setInternship(internshipData);

        if (submissionData) {
          setSubmission(submissionData);

          setSubmissionUrl(
            submissionData.submission_url || ""
          );

          setSubmissionText(
            submissionData.submission_text || ""
          );
        }
      } catch (error) {
        console.error(
          "PROJECT PAGE ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId, router]);

  /*
   * SUBMIT PROJECT
   */

  async function handleSubmitProject() {
    if (submitting) return;

    if (!submissionUrl.trim() && !submissionText.trim()) {
      alert(
        "Please provide either a project URL or project description."
      );
      return;
    }

    try {
      setSubmitting(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      if (!project || !internship) {
        return;
      }

      /*
       * Prevent modification after approval
       */

      if (
        submission &&
        submission.status === "APPROVED"
      ) {
        alert(
          "This project has already been approved."
        );
        return;
      }

      /*
       * UPDATE EXISTING SUBMISSION
       */

      if (submission) {
        const {
          data: updatedSubmission,
          error: updateError,
        } = await supabase
          .from("internship_project_submissions")
          .update({
            submission_url:
              submissionUrl.trim() || null,

            submission_text:
              submissionText.trim() || null,

            status: "SUBMITTED",

            submitted_at: new Date().toISOString(),
          })
          .eq("id", submission.id)
          .eq(
            "user_id",
            session.user.id
          )
          .select(
            `
              id,
              submission_url,
              submission_text,
              status,
              remarks,
              submitted_at
            `
          )
          .single();

        if (updateError) {
          console.error(
            "PROJECT SUBMISSION UPDATE ERROR:",
            updateError
          );

          alert(
            "Unable to update project submission."
          );

          return;
        }

        setSubmission(updatedSubmission);

        alert(
          "Project resubmitted successfully."
        );

        return;
      }

      /*
       * CREATE NEW SUBMISSION
       */

      const {
        data: newSubmission,
        error: insertError,
      } = await supabase
        .from("internship_project_submissions")
        .insert({
          user_id: session.user.id,
          internship_id: internship.id,
          project_id: project.id,

          submission_url:
            submissionUrl.trim() || null,

          submission_text:
            submissionText.trim() || null,

          status: "SUBMITTED",

          submitted_at:
            new Date().toISOString(),
        })
        .select(
          `
            id,
            submission_url,
            submission_text,
            status,
            remarks,
            submitted_at
          `
        )
        .single();

      if (insertError) {
        console.error(
          "PROJECT SUBMISSION INSERT ERROR:",
          insertError
        );

        alert(
          "Unable to submit project. Please try again."
        );

        return;
      }

      setSubmission(newSubmission);

      alert(
        "Project submitted successfully!"
      );
    } catch (error) {
      console.error(
        "PROJECT SUBMISSION ERROR:",
        error
      );

      alert(
        "Something went wrong while submitting the project."
      );
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading Project...
        </p>
      </main>
    );
  }

  if (!project || !internship) {
    return null;
  }

  /*
   * STATUS HELPERS
   */

  const isSubmitted =
    submission?.status === "SUBMITTED";

  const isApproved =
    submission?.status === "APPROVED";

  const isRejected =
    submission?.status === "REJECTED";

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-5xl mx-auto">

        {/* BACK */}

        <Link
          href={`/internships/learn/${internship.slug}`}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Back to Internship
        </Link>

        {/* HEADER */}

        <div className="mt-8">

          <span className="text-orange-400 font-semibold">
            PROJECT {project.project_number}
          </span>

          <h1 className="text-4xl md:text-5xl font-bold mt-3">
            {project.title}
          </h1>

          <p className="text-gray-400 mt-3">
            {internship.title}
          </p>

        </div>

        {/* DESCRIPTION */}

        <section className="mt-10 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold">
            📖 Project Overview
          </h2>

          {project.description ? (
            <p className="text-gray-400 mt-5 leading-8 whitespace-pre-line">
              {project.description}
            </p>
          ) : (
            <p className="text-gray-500 mt-5">
              Project description coming soon.
            </p>
          )}

        </section>

        {/* INSTRUCTIONS */}

        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold">
            📋 Project Instructions
          </h2>

          {project.instructions ? (
            <div className="text-gray-300 mt-5 leading-8 whitespace-pre-line">
              {project.instructions}
            </div>
          ) : (
            <p className="text-gray-500 mt-5">
              Project instructions coming soon.
            </p>
          )}

        </section>

        {/* RESOURCES */}

        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold">
            📁 Project Resources
          </h2>

          {project.resources &&
          project.resources.length > 0 ? (

            <div className="mt-5 space-y-3">

              {project.resources.map(
                (resource, index) => (

                  <a
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl px-5 py-4 transition"
                  >

                    <span className="text-orange-400">
                      📎
                    </span>

                    <span className="text-blue-400 break-all">
                      Resource {index + 1}
                    </span>

                  </a>

                )
              )}

            </div>

          ) : (

            <div className="mt-5 bg-slate-800 rounded-xl p-5 text-gray-400">
              📁 Project resources coming soon.
            </div>

          )}

        </section>

        {/* PROJECT SUBMISSION */}

        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold">
                🎯 Project Submission
              </h2>

              <p className="text-gray-400 mt-2">
                Submit your completed project for review.
              </p>

            </div>

            {/* STATUS */}

            {!submission && (
              <span className="bg-slate-800 text-gray-300 border border-slate-700 px-4 py-2 rounded-full text-sm font-semibold">
                NOT SUBMITTED
              </span>
            )}

            {isSubmitted && (
              <span className="bg-blue-600/20 text-blue-400 border border-blue-600/30 px-4 py-2 rounded-full text-sm font-semibold">
                SUBMITTED
              </span>
            )}

            {isApproved && (
              <span className="bg-green-600/20 text-green-400 border border-green-600/30 px-4 py-2 rounded-full text-sm font-semibold">
                ✓ APPROVED
              </span>
            )}

            {isRejected && (
              <span className="bg-red-600/20 text-red-400 border border-red-600/30 px-4 py-2 rounded-full text-sm font-semibold">
                REQUIRES CHANGES
              </span>
            )}

          </div>

          {/* APPROVED */}

          {isApproved ? (

            <div className="mt-8">

              <div className="bg-green-950/30 border border-green-700/40 rounded-xl p-6">

                <h3 className="text-xl font-bold text-green-400">
                  ✓ Project Approved
                </h3>

                <p className="text-gray-400 mt-2">
                  Congratulations! Your project has been approved.
                </p>

                {submission?.submitted_at && (
                  <p className="text-gray-500 text-sm mt-4">
                    Submitted on{" "}
                    {new Date(
                      submission.submitted_at
                    ).toLocaleDateString("en-GB")}
                  </p>
                )}

              </div>

              {submission?.submission_url && (
                <a
                  href={submission.submission_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-5 bg-slate-800 hover:bg-slate-700 rounded-xl p-5 text-blue-400 break-all"
                >
                  🔗 View Submitted Project
                </a>
              )}

              {submission?.remarks && (
                <div className="mt-5 bg-slate-800 rounded-xl p-5">

                  <p className="text-gray-400 text-sm">
                    Mentor Remarks
                  </p>

                  <p className="text-gray-200 mt-2 whitespace-pre-line">
                    {submission.remarks}
                  </p>

                </div>
              )}

            </div>

          ) : (

            <div className="mt-8 space-y-6">

              {/* URL */}

              <div>

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Project URL
                </label>

                <input
                  type="url"
                  value={submissionUrl}
                  onChange={(e) =>
                    setSubmissionUrl(e.target.value)
                  }
                  placeholder="https://github.com/username/project"
                  disabled={isSubmitted && !isRejected}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-60"
                />

                <p className="text-gray-500 text-xs mt-2">
                  You can provide a GitHub, Google Drive, portfolio, or other project link.
                </p>

              </div>

              {/* DESCRIPTION */}

              <div>

                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Project Description
                </label>

                <textarea
                  value={submissionText}
                  onChange={(e) =>
                    setSubmissionText(e.target.value)
                  }
                  rows={7}
                  placeholder="Explain your project, approach, tools used, results, and important details..."
                  disabled={isSubmitted && !isRejected}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 disabled:opacity-60 resize-y"
                />

              </div>

              {/* REJECTION REMARKS */}

              {isRejected &&
              submission?.remarks && (

                <div className="bg-red-950/30 border border-red-700/40 rounded-xl p-5">

                  <h3 className="font-bold text-red-400">
                    Mentor Feedback
                  </h3>

                  <p className="text-gray-300 mt-2 whitespace-pre-line">
                    {submission.remarks}
                  </p>

                </div>

              )}

              {/* SUBMITTED */}

              {isSubmitted && (

                <div className="bg-blue-950/30 border border-blue-700/40 rounded-xl p-5">

                  <h3 className="font-bold text-blue-400">
                    ⏳ Submission Under Review
                  </h3>

                  <p className="text-gray-400 mt-2">
                    Your project has been submitted successfully.
                    Please wait for mentor/admin review.
                  </p>

                  {submission.submitted_at && (
                    <p className="text-gray-500 text-sm mt-3">
                      Submitted on{" "}
                      {new Date(
                        submission.submitted_at
                      ).toLocaleDateString("en-GB")}
                    </p>
                  )}

                </div>

              )}

              {/* BUTTON */}

              {(!isSubmitted || isRejected) && (

                <button
                  onClick={handleSubmitProject}
                  disabled={submitting}
                  className="w-full md:w-auto bg-orange-600 hover:bg-orange-700 disabled:bg-slate-700 px-8 py-4 rounded-xl font-bold transition"
                >
                  {submitting
                    ? "Submitting..."
                    : isRejected
                    ? "Resubmit Project →"
                    : "Submit Project →"}
                </button>

              )}

            </div>

          )}

        </section>

        {/* BOTTOM NAVIGATION */}

        <div className="mt-8 flex flex-col md:flex-row gap-4">

          <Link
            href={`/internships/learn/${internship.slug}`}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-center py-4 rounded-xl font-bold transition"
          >
            ← Back to Internship
          </Link>

          <Link
            href={`/internships/learn/${internship.slug}`}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-center py-4 rounded-xl font-bold transition"
          >
            Continue Learning →
          </Link>

        </div>

      </div>

    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Submission = {
  id: number;
  user_id: string;
  internship_id: number;
  project_id: number;
  submission_url: string | null;
  submission_text: string | null;
  status: string;
  remarks: string | null;
  submitted_at: string | null;
};

type Student = {
  id: string;
  full_name: string | null;
  college: string | null;
  branch: string | null;
};

type Internship = {
  id: number;
  title: string;
  slug: string;
};

type Project = {
  id: number;
  project_number: number;
  title: string;
};

type AdminSubmission = {
  submission: Submission;
  student: Student | null;
  internship: Internship | null;
  project: Project | null;
};

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [items, setItems] = useState<AdminSubmission[]>([]);

  const [reviewingId, setReviewingId] =
    useState<number | null>(null);

  const [remarks, setRemarks] = useState("");
  const [processing, setProcessing] = useState(false);

  const [message, setMessage] = useState("");

  async function loadSubmissions() {
    try {
      /*
       * AUTHENTICATED USER
       */

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      /*
       * ADMIN CHECK
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
          "ADMIN ACCESS DENIED:",
          profileError
        );

        router.push("/dashboard");
        return;
      }

      setAuthorized(true);

      /*
       * LOAD SUBMISSIONS
       */

      const {
        data: submissions,
        error: submissionError,
      } = await supabase
        .from("internship_project_submissions")
        .select("*")
        .order("submitted_at", {
          ascending: false,
        });

      if (submissionError) {
        console.error(
          "ADMIN SUBMISSIONS ERROR:",
          submissionError
        );

        return;
      }

      /*
       * LOAD RELATED INFORMATION
       */

      const result: AdminSubmission[] = [];

      for (const submission of submissions || []) {
        /*
         * STUDENT
         */

        const { data: student } =
          await supabase
            .from("profiles")
            .select(
              "id, full_name, college, branch"
            )
            .eq("id", submission.user_id)
            .maybeSingle();

        /*
         * INTERNSHIP
         */

        const { data: internship } =
          await supabase
            .from("internships")
            .select("id, title, slug")
            .eq(
              "id",
              submission.internship_id
            )
            .maybeSingle();

        /*
         * PROJECT
         */

        const { data: project } =
          await supabase
            .from("internship_projects")
            .select(
              "id, project_number, title"
            )
            .eq(
              "id",
              submission.project_id
            )
            .maybeSingle();

        result.push({
          submission,
          student,
          internship,
          project,
        });
      }

      setItems(result);
    } catch (error) {
      console.error(
        "ADMIN PAGE ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubmissions();
  }, []);

  /*
   * REVIEW PROJECT
   */

  async function reviewProject(
    submissionId: number,
    status: "APPROVED" | "REVISION_REQUIRED"
  ) {
    if (processing) return;

    const trimmedRemarks =
      remarks.trim();

    if (
      status === "REVISION_REQUIRED" &&
      !trimmedRemarks
    ) {
      setMessage(
        "Please provide remarks explaining what needs to be revised."
      );
      return;
    }

    setProcessing(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/internship-projects/review",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            submissionId,
            status,
            remarks:
              trimmedRemarks || null,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        setMessage(
          result.message ||
            "Review operation failed."
        );
        return;
      }

      /*
       * CLOSE REVIEW PANEL
       */

      setReviewingId(null);
      setRemarks("");

      /*
       * RELOAD DATA
       */

      await loadSubmissions();

      setMessage(
        status === "APPROVED"
          ? "Project approved successfully."
          : "Revision requested successfully."
      );
    } catch (error) {
      console.error(
        "PROJECT REVIEW ERROR:",
        error
      );

      setMessage(
        "Unable to complete the review."
      );
    } finally {
      setProcessing(false);
    }
  }

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading Admin Dashboard...
        </p>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  /*
   * STATISTICS
   */

  const total =
    items.length;

  const pending =
    items.filter(
      ({ submission }) =>
        submission.status ===
          "SUBMITTED" ||
        submission.status ===
          "PENDING"
    ).length;

  const approved =
    items.filter(
      ({ submission }) =>
        submission.status ===
        "APPROVED"
    ).length;

  const revision =
    items.filter(
      ({ submission }) =>
        submission.status ===
        "REVISION_REQUIRED"
    ).length;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <Link
            href="/dashboard"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to Dashboard
          </Link>

          <p className="text-red-400 font-semibold mt-6">
            ADMINISTRATION
          </p>

          <h1 className="text-4xl md:text-5xl font-bold mt-2">
            Admin Dashboard
          </h1>

          <p className="text-gray-400 mt-3">
            Review and manage internship
            project submissions.
          </p>

        </div>

        {/* MESSAGE */}

        {message && (
          <div className="mb-8 bg-blue-900/20 border border-blue-800/40 rounded-xl px-5 py-4 text-blue-300">
            {message}
          </div>
        )}

        {/* STATS */}

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <p className="text-gray-400">
              Total
            </p>

            <p className="text-3xl font-bold mt-2">
              {total}
            </p>
          </div>

          <div className="bg-slate-900 border border-yellow-800/30 rounded-2xl p-6">
            <p className="text-gray-400">
              Pending Review
            </p>

            <p className="text-3xl font-bold text-yellow-400 mt-2">
              {pending}
            </p>
          </div>

          <div className="bg-slate-900 border border-green-800/30 rounded-2xl p-6">
            <p className="text-gray-400">
              Approved
            </p>

            <p className="text-3xl font-bold text-green-400 mt-2">
              {approved}
            </p>
          </div>

          <div className="bg-slate-900 border border-orange-800/30 rounded-2xl p-6">
            <p className="text-gray-400">
              Revision Required
            </p>

            <p className="text-3xl font-bold text-orange-400 mt-2">
              {revision}
            </p>
          </div>

        </div>

        {/* SUBMISSIONS */}

        <section>

          <div className="mb-6">

            <h2 className="text-2xl font-bold">
              Internship Project Submissions
            </h2>

            <p className="text-gray-400 mt-2">
              Review student work and provide
              feedback.
            </p>

          </div>

          {items.length === 0 ? (

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">

              <p className="text-gray-400">
                No project submissions yet.
              </p>

            </div>

          ) : (

            <div className="space-y-6">

              {items.map(
                ({
                  submission,
                  student,
                  internship,
                  project,
                }) => {

                  const isReviewing =
                    reviewingId ===
                    submission.id;

                  const isPending =
                    submission.status ===
                      "SUBMITTED" ||
                    submission.status ===
                      "PENDING";

                  return (
                    <article
                      key={
                        submission.id
                      }
                      className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden"
                    >

                      {/* CARD HEADER */}

                      <div className="p-7">

                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                          <div>

                            <p className="text-sm text-blue-400 font-semibold">
                              {internship?.title ||
                                "Internship"}
                            </p>

                            <h3 className="text-2xl font-bold mt-2">
                              {project
                                ? `Project ${project.project_number}: ${project.title}`
                                : "Project"}
                            </h3>

                            <div className="mt-4 space-y-1">

                              <p className="text-gray-300">
                                <span className="text-gray-500">
                                  Student:
                                </span>{" "}
                                {student?.full_name ||
                                  "Student"}
                              </p>

                              {student?.college && (
                                <p className="text-gray-500 text-sm">
                                  {student.college}
                                  {student.branch
                                    ? ` • ${student.branch}`
                                    : ""}
                                </p>
                              )}

                            </div>

                          </div>

                          <div className="flex flex-col items-start lg:items-end gap-3">

                            <span
                              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                                submission.status ===
                                "APPROVED"
                                  ? "bg-green-600/20 text-green-400 border border-green-600/30"
                                  : submission.status ===
                                    "REVISION_REQUIRED"
                                  ? "bg-orange-600/20 text-orange-400 border border-orange-600/30"
                                  : "bg-yellow-600/20 text-yellow-400 border border-yellow-600/30"
                              }`}
                            >
                              {submission.status ===
                              "REVISION_REQUIRED"
                                ? "REVISION REQUIRED"
                                : submission.status}
                            </span>

                            <p className="text-gray-500 text-sm">
                              {submission.submitted_at
                                ? new Date(
                                    submission.submitted_at
                                  ).toLocaleString(
                                    "en-IN"
                                  )
                                : "Date unavailable"}
                            </p>

                          </div>

                        </div>

                        {/* SUBMISSION */}

                        {submission.submission_url && (
                          <a
                            href={
                              submission.submission_url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex mt-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-5 py-3 rounded-xl text-blue-400 font-semibold transition"
                          >
                            🔗 Open Submitted Project
                          </a>
                        )}

                        {submission.submission_text && (
                          <div className="mt-5 bg-slate-950 border border-slate-800 rounded-xl p-5">

                            <p className="text-gray-500 text-sm mb-2">
                              Student Description
                            </p>

                            <p className="text-gray-300 whitespace-pre-line leading-7">
                              {
                                submission.submission_text
                              }
                            </p>

                          </div>
                        )}

                        {/* EXISTING REMARKS */}

                        {submission.remarks && (
                          <div className="mt-5 bg-orange-950/20 border border-orange-800/30 rounded-xl p-5">

                            <p className="text-orange-400 font-semibold text-sm">
                              Admin Remarks
                            </p>

                            <p className="text-gray-300 mt-2 whitespace-pre-line">
                              {
                                submission.remarks
                              }
                            </p>

                          </div>
                        )}

                        {/* REVIEW BUTTON */}

                        {isPending && (
                          <div className="mt-6">

                            {!isReviewing ? (

                              <button
                                onClick={() => {
                                  setReviewingId(
                                    submission.id
                                  );
                                  setRemarks(
                                    submission.remarks ||
                                      ""
                                  );
                                  setMessage("");
                                }}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition"
                              >
                                Review Project →
                              </button>

                            ) : (

                              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6">

                                <h4 className="text-xl font-bold">
                                  Review Project
                                </h4>

                                <p className="text-gray-400 text-sm mt-2">
                                  Add remarks if the
                                  student needs to make
                                  changes.
                                </p>

                                <textarea
                                  value={
                                    remarks
                                  }
                                  onChange={(e) =>
                                    setRemarks(
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter mentor/admin remarks..."
                                  rows={5}
                                  className="w-full mt-5 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
                                />

                                <div className="flex flex-col sm:flex-row gap-3 mt-5">

                                  <button
                                    disabled={
                                      processing
                                    }
                                    onClick={() =>
                                      reviewProject(
                                        submission.id,
                                        "APPROVED"
                                      )
                                    }
                                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 py-3 rounded-xl font-bold transition"
                                  >
                                    {processing
                                      ? "Processing..."
                                      : "✓ Approve Project"}
                                  </button>

                                  <button
                                    disabled={
                                      processing
                                    }
                                    onClick={() =>
                                      reviewProject(
                                        submission.id,
                                        "REVISION_REQUIRED"
                                      )
                                    }
                                    className="flex-1 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 py-3 rounded-xl font-bold transition"
                                  >
                                    {processing
                                      ? "Processing..."
                                      : "↻ Request Revision"}
                                  </button>

                                  <button
                                    disabled={
                                      processing
                                    }
                                    onClick={() => {
                                      setReviewingId(
                                        null
                                      );
                                      setRemarks(
                                        ""
                                      );
                                    }}
                                    className="sm:w-auto bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold"
                                  >
                                    Cancel
                                  </button>

                                </div>

                              </div>

                            )}

                          </div>
                        )}

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}
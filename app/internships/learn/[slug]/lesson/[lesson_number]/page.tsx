"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Internship = {
  id: number;
  title: string;
  slug: string;
};

type Lesson = {
  id: number;
  internship_id: number;
  lesson_number: number;
  title: string;
  description: string | null;
  video_url: string | null;
  notes_url: string | null;
  duration: string;
};

export default function InternshipLessonPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;
  const lessonNumber = Number(params.lesson_number);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [internship, setInternship] =
    useState<Internship | null>(null);

  const [lesson, setLesson] =
    useState<Lesson | null>(null);

  const [completed, setCompleted] =
    useState(false);

  const [totalLessons, setTotalLessons] =
    useState(0);

  useEffect(() => {
    async function loadLesson() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        /*
         * 1. GET INTERNSHIP
         */

        const {
          data: internshipData,
          error: internshipError,
        } = await supabase
          .from("internships")
          .select("id, title, slug")
          .eq("slug", slug)
          .single();

        if (internshipError || !internshipData) {
          console.error(
            "INTERNSHIP ERROR:",
            internshipError
          );

          router.push("/internships");
          return;
        }

        setInternship(internshipData);

        /*
         * 2. CHECK ENROLLMENT
         */

        const {
          data: enrollment,
          error: enrollmentError,
        } = await supabase
          .from("internship_enrollments")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("internship_id", internshipData.id)
          .maybeSingle();

        if (enrollmentError) {
          console.error(
            "ENROLLMENT CHECK ERROR:",
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
         * 3. GET LESSON
         */

        const {
          data: lessonData,
          error: lessonError,
        } = await supabase
          .from("internship_lessons")
          .select("*")
          .eq("internship_id", internshipData.id)
          .eq("lesson_number", lessonNumber)
          .single();

        if (lessonError || !lessonData) {
          console.error(
            "LESSON ERROR:",
            lessonError
          );

          router.push(
            `/internships/learn/${slug}`
          );

          return;
        }

        setLesson(lessonData);

        /*
         * 4. GET TOTAL LESSONS
         */

        const {
          count,
          error: countError,
        } = await supabase
          .from("internship_lessons")
          .select("id", {
            count: "exact",
            head: true,
          })
          .eq("internship_id", internshipData.id);

        if (!countError) {
          setTotalLessons(count || 0);
        }

        /*
         * 5. CHECK COMPLETION
         */

        const {
          data: progressData,
          error: progressError,
        } = await supabase
          .from("internship_progress")
          .select("id, completed")
          .eq("user_id", session.user.id)
          .eq(
            "internship_id",
            internshipData.id
          )
          .eq(
            "lesson_id",
            lessonData.id
          )
          .maybeSingle();

        if (progressError) {
          console.error(
            "PROGRESS CHECK ERROR:",
            progressError
          );
        }

        setCompleted(
          progressData?.completed === true
        );

      } catch (error) {
        console.error(
          "LESSON PAGE ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadLesson();
  }, [
    slug,
    lessonNumber,
    router,
  ]);

  /*
   * MARK COMPLETE
   */

  async function markComplete() {
    if (!lesson || saving) return;

    try {
      setSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const {
        data: existing,
      } = await supabase
        .from("internship_progress")
        .select("id")
        .eq("user_id", session.user.id)
        .eq(
          "internship_id",
          lesson.internship_id
        )
        .eq(
          "lesson_id",
          lesson.id
        )
        .maybeSingle();

      if (existing) {

        const { error } =
          await supabase
            .from("internship_progress")
            .update({
              completed: true,
            })
            .eq("id", existing.id);

        if (error) {
          console.error(
            "PROGRESS UPDATE ERROR:",
            error
          );

          alert(
            "Unable to update progress."
          );

          return;
        }

      } else {

        const { error } =
          await supabase
            .from("internship_progress")
            .insert({
              user_id:
                session.user.id,

              internship_id:
                lesson.internship_id,

              lesson_id:
                lesson.id,

              completed: true,
            });

        if (error) {
          console.error(
            "PROGRESS INSERT ERROR:",
            error
          );

          alert(
            "Unable to save progress."
          );

          return;
        }
      }

      setCompleted(true);

    } finally {
      setSaving(false);
    }
  }

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading Lesson...
        </p>
      </main>
    );
  }

  if (!lesson || !internship) {
    return null;
  }

  const previousLesson =
    lessonNumber > 1
      ? lessonNumber - 1
      : null;

  const nextLesson =
    lessonNumber < totalLessons
      ? lessonNumber + 1
      : null;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-6xl mx-auto">

        {/* BACK */}

        <Link
          href={`/internships/learn/${slug}`}
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Back to Internship
        </Link>

        {/* HEADER */}

        <div className="mt-6">

          <p className="text-blue-400 font-semibold">
            {internship.title}
          </p>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">

            <h1 className="text-4xl font-bold">
              Lesson {lesson.lesson_number}:{" "}
              {lesson.title}
            </h1>

            <span className="bg-slate-800 px-4 py-2 rounded-full text-sm text-gray-300">
              ⏱ {lesson.duration}
            </span>

          </div>

        </div>

        {/* VIDEO */}

        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          <div className="aspect-video bg-black flex items-center justify-center">

            {lesson.video_url ? (

              <iframe
                src={lesson.video_url}
                title={lesson.title}
                className="w-full h-full"
                allowFullScreen
              />

            ) : (

              <div className="text-center">

                <div className="text-6xl mb-4">
                  🎥
                </div>

                <h2 className="text-2xl font-bold">
                  Video Coming Soon
                </h2>

                <p className="text-gray-500 mt-2">
                  The lesson video will be available
                  soon.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* DESCRIPTION */}

        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <h2 className="text-2xl font-bold">
            About This Lesson
          </h2>

          {lesson.description ? (

            <p className="text-gray-400 mt-4 leading-7">
              {lesson.description}
            </p>

          ) : (

            <p className="text-gray-500 mt-4">
              Lesson description coming soon.
            </p>

          )}

        </section>

        {/* NOTES */}

        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h2 className="text-2xl font-bold">
                📄 Lesson Notes
              </h2>

              <p className="text-gray-400 mt-2">
                Download the notes PDF for this lesson.
              </p>

            </div>

            {lesson.notes_url ? (

              <a
                href={lesson.notes_url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-xl font-bold text-center transition"
              >
                📥 Download Notes PDF
              </a>

            ) : (

              <span className="bg-slate-800 text-gray-400 px-6 py-3 rounded-xl font-semibold text-center">
                📄 Notes Coming Soon
              </span>

            )}

          </div>

        </section>

        {/* COMPLETE */}

        <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <h2 className="text-2xl font-bold">
                Lesson Progress
              </h2>

              <p className="text-gray-400 mt-2">

                {completed
                  ? "You have completed this lesson."
                  : "Complete this lesson after finishing the learning material."}

              </p>

            </div>

            {completed ? (

              <div className="bg-green-600 px-6 py-3 rounded-xl font-bold">
                ✓ Lesson Completed
              </div>

            ) : (

              <button
                onClick={markComplete}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-6 py-3 rounded-xl font-bold transition"
              >
                {saving
                  ? "Saving..."
                  : "✓ Mark Lesson Complete"}
              </button>

            )}

          </div>

        </section>

        {/* NAVIGATION */}

        <div className="mt-8 flex flex-col md:flex-row justify-between gap-4">

          {previousLesson ? (

            <Link
              href={`/internships/learn/${slug}/lesson/${previousLesson}`}
              className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-semibold text-center"
            >
              ← Previous Lesson
            </Link>

          ) : (

            <div />

          )}

          {nextLesson ? (

            <Link
              href={`/internships/learn/${slug}/lesson/${nextLesson}`}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold text-center"
            >
              Next Lesson →
            </Link>

          ) : (

            <Link
              href={`/internships/learn/${slug}`}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl font-semibold text-center"
            >
              ✓ Back to Internship
            </Link>

          )}

        </div>

      </div>

    </main>
  );
}
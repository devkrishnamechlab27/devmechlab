"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Lesson = {
  id: number;
  lesson_number: number;
  title: string;
  description?: string | null;
  video_url?: string | null;
  notes_url?: string | null;
  duration?: string | null;
};

interface CoursePlayerProps {
  course: {
    id: number;
    title: string;
  };
  lessons: Lesson[];
  userId: string;
}

export default function CoursePlayer({
  course,
  lessons,
  userId,
}: CoursePlayerProps) {
  const searchParams = useSearchParams();

const lessonNumber = Number(
  searchParams.get("lesson")
);
  const [selectedLesson, setSelectedLesson] =
  useState<Lesson | null>(
    lessons.find(
      (lesson) =>
        lesson.lesson_number === lessonNumber
    ) ??
      lessons[0] ??
      null
  );
  useEffect(() => {
  if (!lessonNumber || lessons.length === 0) return;

  const targetLesson = lessons.find(
    (lesson) =>
      lesson.lesson_number === lessonNumber
  );

  if (targetLesson) {
    setSelectedLesson(targetLesson);
  }
}, [lessonNumber, lessons]);

  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const [loadingProgress, setLoadingProgress] = useState(true);

  const [saving, setSaving] = useState(false);
  const [certificateIssued, setCertificateIssued] = useState(false);
  const [certificateLoading, setCertificateLoading] = useState(false);

  /*
   * LOAD COMPLETED LESSONS
   */

  useEffect(() => {
    async function loadProgress() {
      setLoadingProgress(true);

      const { data, error } = await supabase
        .from("course_progress")
        .select("lesson_id, completed")
        .eq("user_id", userId)
        .eq("course_id", course.id)
        .eq("completed", true);

      if (error) {
        console.error("LOAD PROGRESS ERROR:", error);
        setLoadingProgress(false);
        return;
      }

      const completedIds =
        data?.map((item) => item.lesson_id) ?? [];

      setCompletedLessons(completedIds);

      setLoadingProgress(false);
    }

    loadProgress();
  }, [userId, course.id]);

  /*
   * COURSE PROGRESS
   */

  const progress =
    lessons.length > 0
      ? Math.round(
          (completedLessons.length / lessons.length) * 100
        )
      : 0;
      /*
 * AUTOMATIC CERTIFICATE ISSUANCE
 */

useEffect(() => {
  async function issueCertificate() {
    if (
      lessons.length === 0 ||
      completedLessons.length !== lessons.length ||
      certificateIssued ||
      certificateLoading
    ) {
      return;
    }

    setCertificateLoading(true);

    try {
  /*
   * GENERATE REAL CERTIFICATE
   */

  const response = await fetch(
    "/api/certificates/generate",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        courseId: course.id,
      }),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error(
      "CERTIFICATE GENERATION ERROR:",
      result
    );

    alert(
      result.error ||
        "Unable to generate certificate."
    );

    setCertificateLoading(false);
    return;
  }

  console.log(
    "CERTIFICATE GENERATED:",
    result
  );

  setCertificateIssued(true);
} catch (error) {
  console.error(
    "CERTIFICATE REQUEST ERROR:",
    error
  );

  alert(
    "Unable to generate certificate."
  );
} finally {
  setCertificateLoading(false);
}
 }

  issueCertificate();
}, [
  completedLessons,
  lessons,
  userId,
  course.id,
  certificateIssued,
  certificateLoading,
]);

  /*
   * MARK LESSON COMPLETE
   */

  async function handleComplete() {
    if (!selectedLesson || saving) return;

    const alreadyCompleted = completedLessons.includes(
      selectedLesson.id
    );

    if (alreadyCompleted) {
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("course_progress")
      .upsert(
        {
          user_id: userId,
          course_id: course.id,
          lesson_id: selectedLesson.id,
          completed: true,
        },
        {
          onConflict: "user_id,course_id,lesson_id",
        }
      );

    if (error) {
      console.error("COMPLETE LESSON ERROR:", error);
      alert("Unable to save lesson progress.");
      setSaving(false);
      return;
    }

    console.log(
      "LESSON COMPLETED:",
      selectedLesson.id
    );

    setCompletedLessons((current) => [
      ...current,
      selectedLesson.id,
    ]);

    setSaving(false);
  }

  /*
   * NO LESSONS
   */

  if (!selectedLesson) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-10">
        <div className="text-center">

          <div className="text-6xl mb-5">
            📚
          </div>

          <h1 className="text-3xl font-bold">
            Lessons Coming Soon
          </h1>

          <p className="text-gray-400 mt-3">
            Lessons for this course are currently
            being prepared.
          </p>

        </div>
      </div>
    );
  }

  return (
    <main className="h-screen overflow-hidden bg-slate-950 text-white">

      <div className="grid h-full min-h-0 lg:grid-cols-4">
        {/* LEFT — LESSONS */}

        <aside className="min-h-0 h-full overflow-y-auto border-r border-slate-800 bg-slate-900 p-6">

          <h2 className="text-2xl font-bold mb-2">
            {course.title}
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Course Lessons
          </p>

          <div className="space-y-3">

            {lessons.map((lesson) => {

              const active =
                selectedLesson.id === lesson.id;

              const completed =
                completedLessons.includes(
                  lesson.id
                );

              return (
                <button
                  key={lesson.id}
                  onClick={() =>
                    setSelectedLesson(lesson)
                  }
                  className={`w-full text-left rounded-xl px-4 py-4 transition border ${
                    active
                      ? "bg-blue-600 border-blue-500"
                      : "bg-slate-800 border-slate-800 hover:bg-slate-700"
                  }`}
                >

                  <div className="flex items-center justify-between">

                    <p className="font-semibold">
                      Lesson {lesson.lesson_number}
                    </p>

                    {completed && (
                      <span className="text-green-400">
                        ✓
                      </span>
                    )}

                  </div>

                  <p
                    className={`text-sm mt-1 ${
                      active
                        ? "text-blue-100"
                        : "text-gray-400"
                    }`}
                  >
                    {lesson.title}
                  </p>

                </button>
              );
            })}

          </div>

        </aside>


        {/* RIGHT — COURSE CONTENT */}

        <section className="min-h-0 h-full overflow-y-auto lg:col-span-3 p-6 md:p-10">

          {/* LESSON HEADER */}

          <div className="mb-8">

            <p className="text-blue-500 font-semibold">
              Lesson {selectedLesson.lesson_number}
            </p>

            <h1 className="text-4xl font-bold mt-2">
              {selectedLesson.title}
            </h1>

            {selectedLesson.description && (
              <p className="text-gray-400 mt-4 text-lg">
                {selectedLesson.description}
              </p>
            )}

          </div>


          {/* VIDEO */}

          <div className="bg-slate-900 rounded-2xl border border-slate-800 h-[400px] flex flex-col items-center justify-center">

            <div className="text-7xl">
              🎥
            </div>

            <h2 className="text-3xl font-bold mt-5">
              Video Coming Soon
            </h2>

            <p className="text-gray-400 mt-3 text-center max-w-xl px-5">
              The video for this lesson is currently
              being prepared.
            </p>

          </div>


          {/* PROGRESS */}

          <div className="mt-10">

            <div className="flex justify-between">

              <span className="font-semibold">
                Course Progress
              </span>

              <span className="text-blue-400 font-semibold">
                {loadingProgress
                  ? "Loading..."
                  : `${progress}%`}
              </span>

            </div>

            <div className="bg-slate-700 rounded-full h-4 mt-3 overflow-hidden">

              <div
                className="bg-blue-500 h-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>


          {/* NOTES */}

          <div className="mt-10 bg-slate-900 rounded-2xl border border-slate-800 p-8">

            <h2 className="text-2xl font-bold">
              📚 Lesson Notes
            </h2>

            <p className="text-gray-400 mt-3">
              Notes for this lesson will be available
              once the course content is published.
            </p>

            <button
              disabled
              className="mt-6 bg-slate-700 text-gray-400 px-6 py-3 rounded-xl font-semibold cursor-not-allowed"
            >
              📥 Notes Coming Soon
            </button>

          </div>


          {/* COMPLETE */}

          <div className="mt-10">

  {progress === 100 ? (

    <div className="bg-green-900/40 border border-green-600 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-green-400">
        🎉 Course Completed!
      </h2>

      <p className="text-gray-300 mt-2">
        Congratulations! You have successfully
        completed all lessons in this course.
      </p>

      {certificateLoading ? (

        <p className="text-gray-400 mt-4">
          Preparing your certificate...
        </p>

      ) : certificateIssued ? (

        <p className="text-green-400 mt-4 font-semibold">
          🏆 Your certificate has been issued!
        </p>

      ) : null}

    </div>

  ) : completedLessons.includes(
      selectedLesson.id
    ) ? (

    <button
      disabled
      className="bg-green-600 px-8 py-4 rounded-xl font-bold cursor-default"
    >
      ✓ Lesson Completed
    </button>

  ) : (

    <button
      onClick={handleComplete}
      disabled={saving}
      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 px-8 py-4 rounded-xl font-bold transition"
    >
      {saving
        ? "Saving..."
        : "✓ Mark Lesson Complete"}
    </button>

  )}

</div>

        </section>

      </div>

    </main>
  );
}
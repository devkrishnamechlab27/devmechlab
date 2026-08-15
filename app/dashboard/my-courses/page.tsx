"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Course = {
  id: number;
  title: string;
  slug: string;
  image: string;
  instructor: string;
  duration: string;
};

type MyCourse = {
  course: Course;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  continueLesson: number | null;
};

export default function MyCoursesPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<MyCourse[]>([]);

  useEffect(() => {
    async function loadCourses() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      /*
       * GET ENROLLED COURSES
       */

      const { data: enrollments, error: enrollmentError } =
        await supabase
          .from("enrollments")
          .select(`
            courses (
              id,
              title,
              slug,
              image,
              instructor,
              duration
            )
          `)
          .eq("user_id", session.user.id);

      if (enrollmentError) {
        console.error(
          "ENROLLMENTS ERROR:",
          enrollmentError
        );

        setLoading(false);
        return;
      }

      if (!enrollments || enrollments.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      /*
       * BUILD REAL COURSE PROGRESS
       */

      const result: MyCourse[] = [];

      for (const enrollment of enrollments as any[]) {
        const course = enrollment.courses as Course;

        if (!course) continue;

        /*
         * TOTAL LESSONS
         */

        const { data: lessons, error: lessonsError } =
  await supabase
    .from("lessons")
    .select("id, lesson_number")
    .eq("course_id", course.id)
    .order("lesson_number");

        if (lessonsError) {
          console.error(
            "LESSONS ERROR:",
            lessonsError
          );
        }

        const totalLessons = lessons?.length ?? 0;

        /*
         * COMPLETED LESSONS
         */

        const { data: completed, error: progressError } =
          await supabase
            .from("course_progress")
            .select("lesson_id")
            .eq("user_id", session.user.id)
            .eq("course_id", course.id)
            .eq("completed", true);

        if (progressError) {
          console.error(
            "COURSE PROGRESS ERROR:",
            progressError
          );
        }

        const completedLessons =
          completed?.length ?? 0;
          const completedIds =
  new Set(
    completed?.map((item: any) => item.lesson_id) ?? []
  );

const nextLesson =
  lessons?.find(
    (lesson: any) => !completedIds.has(lesson.id)
  );

const continueLesson =
  nextLesson?.lesson_number ??
  lessons?.[lessons.length - 1]?.lesson_number ??
  null;

        /*
         * CALCULATE REAL PROGRESS
         */

        const progress =
          totalLessons > 0
            ? Math.round(
                (completedLessons / totalLessons) * 100
              )
            : 0;

        result.push({
  course,
  progress,
  completedLessons,
  totalLessons,
  continueLesson,
});
      }

      setCourses(result);

      setLoading(false);
    }

    loadCourses();
  }, [router]);

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[70vh] text-white">
        Loading My Courses...
      </main>
    );
  }

  /*
   * PAGE
   */

  return (
    <main className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          My Courses
        </h1>

        <p className="text-gray-400 mt-2">
          Continue learning where you left off.
        </p>
      </div>

      {courses.length === 0 ? (

        /*
         * NO COURSES
         */

        <div className="bg-slate-900 rounded-2xl p-10 text-center">

          <h2 className="text-2xl font-bold">
            No Courses Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Enroll in your first course to start learning.
          </p>

          <Link
            href="/courses"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold"
          >
            Browse Courses
          </Link>

        </div>

      ) : (

        /*
         * COURSE CARDS
         */

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {courses.map((item) => (

            <div
              key={item.course.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-blue-500 transition"
            >

              {/* IMAGE */}

              <img
                src={item.course.image}
                alt={item.course.title}
                className="rounded-xl h-48 w-full object-cover"
              />

              {/* TITLE */}

              <h2 className="text-2xl font-bold mt-5">
                {item.course.title}
              </h2>

              {/* INSTRUCTOR */}

              <p className="text-gray-400 mt-2">
                {item.course.instructor}
              </p>

              {/* DURATION */}

              <p className="text-gray-500">
                {item.course.duration}
              </p>

              {/* PROGRESS */}

              <div className="mt-6">

                <div className="flex justify-between text-sm">

                  <span>
                    Course Progress
                  </span>

                  <span className="font-semibold text-blue-400">
                    {item.progress}%
                  </span>

                </div>

                <div className="bg-slate-700 h-3 rounded-full mt-2 overflow-hidden">

                  <div
                    className="bg-blue-500 h-full transition-all duration-500"
                    style={{
                      width: `${item.progress}%`,
                    }}
                  />

                </div>

                <p className="text-gray-500 text-sm mt-2">
                  {item.completedLessons} /{" "}
                  {item.totalLessons} lessons completed
                </p>

              </div>

              {/* BUTTON */}

              {item.progress >= 100 ? (
  <div className="block mt-6 bg-green-600 text-center py-3 rounded-xl font-bold">
    ✓ Course Completed
  </div>
) : (
  <Link
    href={`/learn/${item.course.slug}?lesson=${item.continueLesson}`}
    className="block mt-6 bg-blue-600 hover:bg-blue-700 text-center py-3 rounded-xl font-bold transition"
  >
    Continue Learning →
  </Link>
)}

            </div>

          ))}

        </div>

      )}

    </main>
  );
}
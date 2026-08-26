"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Internship = {
  id: number;
  title: string;
  slug: string;
  banner: string;
  mentor: string;
  duration: string;
};

type MyInternship = {
  internship: Internship;
  progress: number;
  completedLessons: number;
  totalLessons: number;
};

export default function MyInternshipsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<MyInternship[]>([]);

  useEffect(() => {
    async function loadInternships() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      /*
       * GET ENROLLED INTERNSHIPS
       */

      const {
        data: enrollments,
        error: enrollmentError,
      } = await supabase
        .from("internship_enrollments")
        .select(`
          id,
          internship_id,
          program_name,
          status,
          created_at
        `)
        .eq("user_id", session.user.id)
        .eq("status", "ENROLLED")
        .order("created_at", {
          ascending: false,
        });

      if (enrollmentError) {
        console.error(
          "INTERNSHIP ENROLLMENTS ERROR:",
          enrollmentError
        );

        setLoading(false);
        return;
      }

      if (!enrollments || enrollments.length === 0) {
        setInternships([]);
        setLoading(false);
        return;
      }

      /*
       * BUILD INTERNSHIP CARDS
       */

      const result: MyInternship[] = [];

      for (const enrollment of enrollments as any[]) {
        if (!enrollment.internship_id) {
          console.warn(
            "INTERNSHIP ID MISSING:",
            enrollment
          );
          continue;
        }

        /*
         * GET INTERNSHIP
         */

        const {
          data: internship,
          error: internshipError,
        } = await supabase
          .from("internships")
          .select(`
            id,
            title,
            slug,
            banner,
            mentor,
            duration
          `)
          .eq("id", enrollment.internship_id)
          .single();

        if (internshipError || !internship) {
          console.error(
            "INTERNSHIP LOOKUP ERROR:",
            internshipError
          );
          continue;
        }

        /*
 * REAL INTERNSHIP PROGRESS
 */

/* TOTAL LESSONS */

const {
  data: lessons,
  error: lessonsError,
} = await supabase
  .from("internship_lessons")
  .select("id, lesson_number")
  .eq("internship_id", internship.id)
  .order("lesson_number", {
    ascending: true,
  });

if (lessonsError) {
  console.error(
    "INTERNSHIP LESSONS ERROR:",
    lessonsError
  );
}

const totalLessons = lessons?.length ?? 0;


/* COMPLETED LESSONS */

const {
  data: completed,
  error: progressError,
} = await supabase
  .from("internship_progress")
  .select("lesson_id")
  .eq("user_id", session.user.id)
  .eq("internship_id", internship.id)
  .eq("completed", true);

if (progressError) {
  console.error(
    "INTERNSHIP PROGRESS ERROR:",
    progressError
  );
}

const completedLessons = completed?.length ?? 0;


/* REAL PROGRESS */

const progress =
  totalLessons > 0
    ? Math.round(
        (completedLessons / totalLessons) * 100
      )
    : 0;


/* SAVE RESULT */

result.push({
  internship,
  progress,
  completedLessons,
  totalLessons,
});
      }

      setInternships(result);
      setLoading(false);
    }

    loadInternships();
  }, [router]);

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[70vh] text-white">
        Loading My Internships...
      </main>
    );
  }

  /*
   * PAGE
   */

  return (
    <main className="space-y-8">

      {/* HEADER */}

      <div>
        <h1 className="text-4xl font-bold text-white">
          My Internships
        </h1>

        <p className="text-gray-400 mt-2">
          Continue your internship where you left off.
        </p>
      </div>

      {internships.length === 0 ? (

        /*
         * NO INTERNSHIPS
         */

        <div className="bg-slate-900 rounded-2xl p-10 text-center">

          <h2 className="text-2xl font-bold text-white">
            No Internships Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Enroll in an internship to start your
            engineering journey.
          </p>

          <Link
            href="/internships"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition"
          >
            Browse Internships
          </Link>

        </div>

      ) : (

        /*
         * INTERNSHIP CARDS
         */

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {internships.map((item) => (

            <div
              key={item.internship.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-blue-500 transition"
            >

              {/* IMAGE */}

              <img
                src={item.internship.banner}
                alt={item.internship.title}
                className="rounded-xl h-48 w-full object-cover"
              />

              {/* TITLE */}

              <h2 className="text-2xl font-bold mt-5 text-white">
                {item.internship.title}
              </h2>

              {/* MENTOR */}

              <p className="text-gray-400 mt-2">
                {item.internship.mentor}
              </p>

              {/* DURATION */}

              <p className="text-gray-500">
                {item.internship.duration}
              </p>

              {/* PROGRESS */}

              <div className="mt-6">

                <div className="flex justify-between text-sm">

                  <span>
                    Internship Progress
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
                  ✓ Internship Completed
                </div>

              ) : (

                <Link
                  href={`/internships/learn/${item.internship.slug}`}
                  className="block mt-6 bg-blue-600 hover:bg-blue-700 text-center py-3 rounded-xl font-bold transition"
                >
                  Continue Internship →
                </Link>

              )}

            </div>

          ))}

        </div>

      )}

    </main>
  );
}
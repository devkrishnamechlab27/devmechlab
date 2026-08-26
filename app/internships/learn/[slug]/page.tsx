"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

type Internship = {
  id: number;
  slug: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  mentor: string;
  language: string;
};

type Lesson = {
  id: number;
  lesson_number: number;
  title: string;
  description: string | null;
  video_url: string;
  notes_url: string | null;
  duration: string;
};

type Project = {
  id: number;
  project_number: number;
  title: string;
  description: string | null;
  instructions: string | null;
};

type Progress = {
  lesson_id: number;
  completed: boolean;
};

export default function InternshipLearnPage() {
  const router = useRouter();
  const params = useParams();

  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [internship, setInternship] =
    useState<Internship | null>(null);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        /*
         * 1. LOAD INTERNSHIP
         */

        const {
          data: internshipData,
          error: internshipError,
        } = await supabase
          .from("internships")
          .select("*")
          .eq("slug", slug)
          .single();

        if (internshipError || !internshipData) {
          console.error(
            "INTERNSHIP LOAD ERROR:",
            internshipError
          );

          router.push("/internships");
          return;
        }

        /*
         * 2. VERIFY ENROLLMENT
         */

        const {
          data: enrollment,
          error: enrollmentError,
        } = await supabase
          .from("internship_enrollments")
          .select("id, status")
          .eq("user_id", session.user.id)
          .eq("internship_id", internshipData.id)
          .maybeSingle();

        if (enrollmentError) {
          console.error(
            "INTERNSHIP ENROLLMENT CHECK ERROR:",
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
         * 3. LOAD LESSONS
         */

        const {
          data: lessonData,
          error: lessonError,
        } = await supabase
          .from("internship_lessons")
          .select("*")
          .eq("internship_id", internshipData.id)
          .order("lesson_number", {
            ascending: true,
          });

        if (lessonError) {
          console.error(
            "INTERNSHIP LESSONS ERROR:",
            lessonError
          );
        }

        /*
         * 4. LOAD PROJECTS
         */

        const {
          data: projectData,
          error: projectError,
        } = await supabase
          .from("internship_projects")
          .select(
            "id, project_number, title, description, instructions"
          )
          .eq("internship_id", internshipData.id)
          .order("project_number", {
            ascending: true,
          });

        if (projectError) {
          console.error(
            "INTERNSHIP PROJECTS ERROR:",
            projectError
          );
        }

        /*
         * 5. LOAD STUDENT PROGRESS
         */

        const {
          data: progressData,
          error: progressError,
        } = await supabase
          .from("internship_progress")
          .select("lesson_id, completed")
          .eq("user_id", session.user.id)
          .eq("internship_id", internshipData.id)
          .eq("completed", true);

        if (progressError) {
          console.error(
            "INTERNSHIP PROGRESS ERROR:",
            progressError
          );
        }

        /*
         * 6. SAVE DATA
         */

        setInternship(internshipData);

        setLessons(lessonData || []);

        setProjects(projectData || []);

        setProgress(progressData || []);
      } catch (error) {
        console.error(
          "INTERNSHIP WORKSPACE ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadWorkspace();
  }, [slug, router]);

  /*
   * LOADING
   */

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-gray-400 text-lg">
          Loading Internship Workspace...
        </p>
      </main>
    );
  }

  if (!internship) {
    return null;
  }

  /*
   * PROGRESS
   */

  const completedLessonIds = new Set(
    progress.map((item) => item.lesson_id)
  );

  const completedLessons =
    completedLessonIds.size;

  const totalLessons = lessons.length;

  const progressPercentage =
    totalLessons > 0
      ? Math.round(
          (completedLessons / totalLessons) * 100
        )
      : 0;

  /*
   * NEXT LESSON
   */

  const nextLesson =
    lessons.find(
      (lesson) =>
        !completedLessonIds.has(lesson.id)
    ) || lessons[lessons.length - 1];

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <Link
            href="/dashboard/internships"
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            ← Back to My Internships
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mt-5">
            {internship.title}
          </h1>

          <p className="text-gray-400 mt-3 max-w-3xl">
            {internship.description}
          </p>

        </div>

        {/* OVERVIEW */}

        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-gray-400">
              Duration
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {internship.duration}
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-gray-400">
              Lessons
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {completedLessons} / {totalLessons}
            </h2>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

            <p className="text-gray-400">
              Projects
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {projects.length}
            </h2>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-10">

          <div className="flex justify-between items-center">

            <div>

              <h2 className="text-2xl font-bold">
                Internship Progress
              </h2>

              <p className="text-gray-400 mt-2">
                {completedLessons} of{" "}
                {totalLessons} lessons completed
              </p>

            </div>

            <span className="text-3xl font-bold text-blue-400">
              {progressPercentage}%
            </span>

          </div>

          <div className="mt-5 bg-slate-700 h-4 rounded-full overflow-hidden">

            <div
              className="bg-blue-500 h-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
              }}
            />

          </div>

        </div>

        {/* CONTINUE */}

        {nextLesson && (
          <div className="bg-gradient-to-r from-blue-900/40 to-slate-900 border border-blue-800/50 rounded-2xl p-8 mb-10">

            <p className="text-blue-400 font-semibold">
              {progressPercentage === 0
                ? "START INTERNSHIP"
                : progressPercentage >= 100
                ? "INTERNSHIP COMPLETED"
                : "CONTINUE LEARNING"}
            </p>

            <h2 className="text-3xl font-bold mt-2">
              Lesson {nextLesson.lesson_number}:{" "}
              {nextLesson.title}
            </h2>

            <p className="text-gray-400 mt-3">
              {nextLesson.description}
            </p>

            {progressPercentage < 100 ? (
              <Link
                href={`/internships/learn/${slug}/lesson/${nextLesson.lesson_number}`}
                className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition"
              >
                Continue Internship →
              </Link>
            ) : (
              <div className="inline-block mt-6 bg-green-600 px-8 py-3 rounded-xl font-bold">
                ✓ Internship Lessons Completed
              </div>
            )}

          </div>
        )}

        {/* LESSONS */}

        <section className="mb-12">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-3xl font-bold">
                📚 Internship Lessons
              </h2>

              <p className="text-gray-400 mt-2">
                Complete each lesson to progress through
                the internship.
              </p>

            </div>

            <span className="text-gray-400">
              {totalLessons} Lessons
            </span>

          </div>

          <div className="space-y-3">

            {lessons.map((lesson) => {

              const completed =
                completedLessonIds.has(
                  lesson.id
                );

              return (
                <div
                  key={lesson.id}
                  className={`border rounded-2xl p-5 transition ${
                    completed
                      ? "border-green-700/40 bg-green-950/20"
                      : "border-slate-800 bg-slate-900 hover:border-blue-600"
                  }`}
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div className="flex items-center gap-4">

                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${
                          completed
                            ? "bg-green-600"
                            : "bg-slate-800"
                        }`}
                      >
                        {completed
                          ? "✓"
                          : lesson.lesson_number}
                      </div>

                      <div>

                        <h3 className="font-bold text-lg">
                          {lesson.title}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          {lesson.duration}
                        </p>

                      </div>

                    </div>

                    <Link
                      href={`/internships/learn/${slug}/lesson/${lesson.lesson_number}`}
                      className={`px-6 py-2 rounded-xl text-center font-semibold ${
                        completed
                          ? "bg-slate-800 hover:bg-slate-700"
                          : "bg-blue-600 hover:bg-blue-700"
                      }`}
                    >
                      {completed
                        ? "Review"
                        : "Start Lesson"}
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        </section>
        {/* TEMPORARY CERTIFICATE API TEST */}

{internship.id === 2 && (
  <div className="mb-10 bg-yellow-950/30 border border-yellow-700/50 rounded-2xl p-6">
    <h2 className="text-xl font-bold text-yellow-400">
      Certificate API Test
    </h2>

    <p className="text-gray-400 mt-2">
      Current progress: {completedLessons} / {totalLessons}
    </p>

    <button
      onClick={async () => {
        try {
          const response = await fetch(
            "/api/internship-certificates/generate", 
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                internshipId: internship.id,
              }),
            }
          );

          const data = await response.json();

          console.log(
            "INTERNSHIP CERTIFICATE TEST:",
            data
          );

          alert(
            JSON.stringify(data, null, 2)
          );
        } catch (error) {
          console.error(
            "CERTIFICATE API TEST ERROR:",
            error
          );

          alert(
            "Certificate API request failed."
          );
        }
      }}
      className="mt-4 bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-xl font-bold"
    >
      Test Certificate API
    </button>
  </div>
)}

        {/* PROJECTS */}

        <section>

          <div className="mb-6">

            <h2 className="text-3xl font-bold">
              🛠 Internship Projects
            </h2>

            <p className="text-gray-400 mt-2">
              Apply what you learn through practical
              engineering projects.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            {projects.map((project) => (

              <div
                key={project.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-orange-500 transition"
              >

                <span className="text-orange-400 text-sm font-semibold">
                  PROJECT {project.project_number}
                </span>

                <h3 className="text-xl font-bold mt-3">
                  {project.title}
                </h3>

                <p className="text-gray-400 mt-3 text-sm">
                  {project.description}
                </p>

                <Link
                  href={`/internships/projects/${project.id}`}
                  className="block mt-6 bg-orange-600 hover:bg-orange-700 text-center py-3 rounded-xl font-bold transition"
                >
                  Open Project →
                </Link>

              </div>

            ))}

          </div>

        </section>

      </div>

    </main>
  );
}
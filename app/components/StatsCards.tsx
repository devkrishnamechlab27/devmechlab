"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function StatsCards() {
  const [courseCount, setCourseCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [internshipCount, setInternshipCount] = useState(0);
  const [learningStreak, setLearningStreak] = useState(0);

  useEffect(() => {
    async function loadStats() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      /*
       * 1. COURSE COUNT
       */
      const {
        count: coursesCount,
        error: coursesError,
      } = await supabase
        .from("enrollments")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      if (coursesError) {
        console.error(
          "COURSE COUNT ERROR:",
          coursesError
        );
      } else {
        setCourseCount(coursesCount ?? 0);
      }

      /*
       * 2. COURSE CERTIFICATE COUNT
       */
      const {
        count: courseCertificatesCount,
        error: courseCertificatesError,
      } = await supabase
        .from("certificates")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      if (courseCertificatesError) {
        console.error(
          "COURSE CERTIFICATE COUNT ERROR:",
          courseCertificatesError
        );
      }

      /*
       * 3. INTERNSHIP CERTIFICATE COUNT
       */
      const {
        count: internshipCertificatesCount,
        error: internshipCertificatesError,
      } = await supabase
        .from("internship_certificates")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      if (internshipCertificatesError) {
        console.error(
          "INTERNSHIP CERTIFICATE COUNT ERROR:",
          internshipCertificatesError
        );
      }

      /*
       * TOTAL CERTIFICATES
       */
      setCertificateCount(
        (courseCertificatesCount ?? 0) +
          (internshipCertificatesCount ?? 0)
      );

      /*
       * 4. INTERNSHIP COUNT
       */
      const {
        count: internshipsCount,
        error: internshipsError,
      } = await supabase
        .from("internship_enrollments")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      if (internshipsError) {
        console.error(
          "INTERNSHIP COUNT ERROR:",
          internshipsError
        );
      } else {
        setInternshipCount(
          internshipsCount ?? 0
        );
      }

      /*
       * 5. LEARNING STREAK
       *
       * Course + internship completed
       * lesson activity is combined.
       */
      const {
        data: courseActivity,
        error: courseActivityError,
      } = await supabase
        .from("course_progress")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (courseActivityError) {
        console.error(
          "COURSE STREAK ERROR:",
          courseActivityError
        );
      }

      const {
        data: internshipActivity,
        error: internshipActivityError,
      } = await supabase
        .from("internship_progress")
        .select("created_at")
        .eq("user_id", user.id)
        .eq("completed", true);

      if (internshipActivityError) {
        console.error(
          "INTERNSHIP STREAK ERROR:",
          internshipActivityError
        );
      }

      /*
       * Convert timestamp to local calendar date.
       *
       * Example:
       * 2026-08-27T10:30:00
       * becomes
       * 2026-08-27
       */
      function getDateKey(timestamp: string) {
        const date = new Date(timestamp);

        const year = date.getFullYear();
        const month = String(
          date.getMonth() + 1
        ).padStart(2, "0");
        const day = String(
          date.getDate()
        ).padStart(2, "0");

        return `${year}-${month}-${day}`;
      }

      /*
       * Collect unique learning dates.
       */
      const learningDates = new Set<string>();

      for (const row of courseActivity ?? []) {
        if (row.created_at) {
          learningDates.add(
            getDateKey(row.created_at)
          );
        }
      }

      for (const row of internshipActivity ?? []) {
        if (row.created_at) {
          learningDates.add(
            getDateKey(row.created_at)
          );
        }
      }

      /*
       * Calculate consecutive streak.
       *
       * The streak starts from today.
       *
       * If today has activity:
       * today → yesterday → day before...
       *
       * If today has no activity but yesterday has:
       * yesterday → day before...
       *
       * Otherwise:
       * 0 days.
       */
      function getLearningStreak(
        dates: Set<string>
      ) {
        if (dates.size === 0) {
          return 0;
        }

        const today = new Date();

        today.setHours(
          0,
          0,
          0,
          0
        );

        const todayKey = getDateKey(
          today.toISOString()
        );

        /*
         * Start today if there is activity.
         * Otherwise allow the streak to continue
         * from yesterday.
         */
        let currentDate = new Date(today);

        if (!dates.has(todayKey)) {
          currentDate.setDate(
            currentDate.getDate() - 1
          );

          const yesterdayKey =
            getDateKey(
              currentDate.toISOString()
            );

          if (!dates.has(yesterdayKey)) {
            return 0;
          }
        }

        let streak = 0;

        while (true) {
          const dateKey =
            getDateKey(
              currentDate.toISOString()
            );

          if (!dates.has(dateKey)) {
            break;
          }

          streak++;

          currentDate.setDate(
            currentDate.getDate() - 1
          );
        }

        return streak;
      }

      const streak =
        getLearningStreak(
          learningDates
        );

      setLearningStreak(streak);
    }

    loadStats();
  }, []);

  const cards = [
    {
      icon: "📚",
      title: "My Courses",
      value: courseCount,
      color: "text-blue-400",
      button: "View My Courses",
      href: "/dashboard/my-courses",
    },
    {
      icon: "🏆",
      title: "Certificates",
      value: certificateCount,
      color: "text-yellow-400",
      button: "View Certificates",
      href: "/dashboard/certificates",
    },
    {
      icon: "💼",
      title: "Internships",
      value: internshipCount,
      color: "text-green-400",
      button: "View Internships",
      href: "/dashboard/internships",
    },
    {
      icon: "🔥",
      title: "Learning Streak",
      value: `${learningStreak} ${
        learningStreak === 1
          ? "Day"
          : "Days"
      }`,
      color: "text-orange-400",
      button: "Keep Learning",
      href: "/dashboard/my-courses",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300"
        >
          <div className="text-4xl">
            {card.icon}
          </div>

          <h2 className="text-xl font-bold mt-4">
            {card.title}
          </h2>

          <p
            className={`text-4xl font-bold mt-3 ${card.color}`}
          >
            {card.value}
          </p>

          <Link
            href={card.href}
            className="inline-block mt-6 text-blue-400 hover:text-blue-300 font-semibold"
          >
            {card.button} →
          </Link>
        </div>
      ))}
    </div>
  );
}
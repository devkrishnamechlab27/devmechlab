"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function StatsCards() {
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    async function loadCourseCount() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { count, error } = await supabase
        .from("enrollments")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      if (error) {
        console.error(
          "COURSE COUNT ERROR:",
          error
        );
        return;
      }

      setCourseCount(count ?? 0);
    }

    loadCourseCount();
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
      value: 0,
      color: "text-yellow-400",
      button: "View Certificates",
      href: "/certificates",
    },
    {
      icon: "💼",
      title: "Internships",
      value: 0,
      color: "text-green-400",
      button: "Browse Internships",
      href: "/internships",
    },
    {
      icon: "🔥",
      title: "Learning Streak",
      value: "0 Days",
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
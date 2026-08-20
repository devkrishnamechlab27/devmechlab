"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function StatsCards() {
  
  const [courseCount, setCourseCount] = useState(0);
  const [certificateCount, setCertificateCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
  console.log("🔥 STATS CARDS LOADED");

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("🔥 DASHBOARD USER:", user?.id);
     
      if (!user) {
        setLoading(false);
        return;
      }

      /*
       * COURSES
       */

      const {
        count: courses,
        error: courseError,
      } = await supabase
        .from("enrollments")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("user_id", user.id);

      if (courseError) {
        console.error(
          "COURSE COUNT ERROR:",
          courseError
        );
      }

      /*
       * CERTIFICATES
       */

      const {
  data: certificatesData,
  error: certificateError,
} = await supabase
  .from("certificates")
  .select("id, certificate_number, user_id")
  .eq("user_id", user.id);

console.log("🔥 CERTIFICATES DATA:", certificatesData);
console.log("🔥 CERTIFICATE ERROR:", certificateError);

const certificates = certificatesData?.length ?? 0;
      if (certificateError) {
        console.error(
          "CERTIFICATE COUNT ERROR:",
          certificateError
        );
      }

      setCourseCount(courses ?? 0);
      setCertificateCount(certificates ?? 0);
      setLoading(false);
    }

    loadStats();
  }, []);

  const stats = [
    {
      title: "Courses",
      value: loading ? "..." : String(courseCount),
      color: "text-blue-400",
    },
    {
      title: "Internships",
      value: "0",
      color: "text-orange-400",
    },
    {
      title: "Certificates",
      value: loading ? "..." : String(certificateCount),
      color: "text-emerald-400",
    },
    {
      title: "Payments",
      value: "₹1999",
      color: "text-pink-400",
    },
  ];

  return (
    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
        >
          <p className="text-gray-400">
            {item.title}
          </p>

          <h2
            className={`text-4xl font-bold mt-3 ${item.color}`}
          >
            {item.value}
          </h2>
        </div>
      ))}

    </section>
  );
}
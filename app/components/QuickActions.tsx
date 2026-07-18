"use client";

import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        <Link
          href="/courses"
          className="bg-blue-600 hover:bg-blue-700 rounded-xl p-5 text-center font-semibold transition"
        >
          📚 Browse Courses
        </Link>

        <Link
          href="/internships"
          className="bg-green-600 hover:bg-green-700 rounded-xl p-5 text-center font-semibold transition"
        >
          💼 Browse Internships
        </Link>

        <Link
          href="/certificates"
          className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-xl p-5 text-center font-semibold transition"
        >
          🏆 Certificates
        </Link>

      </div>

    </div>
  );
}
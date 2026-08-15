"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function InternshipPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    async function loadApplications() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("internship_applications")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) {
        setApplications(data);
      }

      setLoading(false);
    }

    loadApplications();
  }, [router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-[70vh] text-white">
        Loading Internships...
      </main>
    );
  }

  return (
    <main className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Internship Portal
        </h1>

        <p className="text-gray-400 mt-2">
          Apply for internships and track your application status.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

        <h2 className="text-2xl font-bold">
          Current Internship
        </h2>

        <p className="text-gray-400 mt-3">
          Mechanical Engineering Virtual Internship
        </p>

        <ul className="mt-6 space-y-2 text-gray-300">
          <li>✔ Live Engineering Projects</li>
          <li>✔ Industry Mentorship</li>
          <li>✔ Certificate of Completion</li>
          <li>✔ Letter of Recommendation</li>
          <li>✔ Placement Guidance</li>
        </ul>

        <button className="mt-8 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold">
          Enroll Now
        </button>

      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-6">
          My Enrollment
        </h2>

        {applications.length === 0 ? (
          <p className="text-gray-400">
            You haven't applied for any internship yet.
          </p>
        ) : (
          applications.map((item) => (
            <div
              key={item.id}
              className="border border-slate-700 rounded-xl p-5 mb-4"
            >
              <h3 className="text-xl font-semibold">
                {item.program_name}
              </h3>

              <p className="text-gray-400 mt-2">
                Status:
                {" "}
                <span className="text-green-400">
                  {item.status}
                </span>
              </p>
            </div>
          ))
        )}

      </div>

    </main>
  );
}
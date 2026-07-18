"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      setUserEmail(session.user.email ?? "");
      setLoading(false);
    }

    checkUser();
  }, [router]);

  async function logout() {
    await supabase.auth.signOut();
   router.replace("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Loading Dashboard...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center">

          <div>

           <h1 className="text-5xl font-bold">
                 Welcome 👋
          </h1>

             <p className="text-gray-400 mt-3">
                {userEmail}
            </p>

           <div className="mt-6">
             <Link
               href="/profile"
               className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold"
            >
                  Edit Profile
            </Link>
          </div>

          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-semibold"
          >
            Logout
          </button>

        </div>

      </div>

    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setEmail(session.user.email ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setFullName(data.full_name ?? "");
        setCollege(data.college ?? "");
        setBranch(data.branch ?? "");
        setPhone(data.phone ?? "");
      }

      setLoading(false);
    }

    loadProfile();
  }, [router]);

  async function saveProfile() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        college,
        branch,
        phone,
      })
      .eq("id", session.user.id);

    if (!error) {
      alert("Profile updated successfully.");
    } else {
      alert(error.message);
    }
  }

  if (loading) {
    return (
      <main className="flex justify-center items-center min-h-[70vh] text-white">
        Loading Profile...
      </main>
    );
  }

  return (
    <main className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          My Profile
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your personal information.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6">

        <div>
          <label className="text-sm text-gray-400">
            Full Name
          </label>

          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full mt-2 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Email
          </label>

          <input
            value={email}
            disabled
            className="w-full mt-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            College
          </label>

          <input
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            className="w-full mt-2 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Branch
          </label>

          <input
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full mt-2 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-400">
            Phone
          </label>

          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-2 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3"
          />
        </div>

        <button
          onClick={saveProfile}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
        >
          Save Changes
        </button>

      </div>

    </main>
  );
}
"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");

  useEffect(() => {
  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setFullName(data.full_name ?? "");
      setPhone(data.phone ?? "");
      setCollege(data.college ?? "");
      setBranch(data.branch ?? "");
      setLinkedin(data.linkedin ?? "");
      setGithub(data.github ?? "");
    }

    setLoading(false);
  }

  loadProfile();
}, []);

async function saveProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;
  
  console.log("Current User ID:", user.id);

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone,
      college,
      branch,
      linkedin,
      github,
      profile_completed: true,
    })
    .eq("id", user.id);

  if (error) {
  console.log("UPDATE ERROR:", error);
  alert(JSON.stringify(error, null, 2));
  return;
}

  alert("Profile updated successfully!");

   router.push("/dashboard");
}

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Loading Profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Edit Profile
        </h1>

        <div className="space-y-5">

          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
            className="w-full bg-slate-800 rounded-xl px-5 py-4"
          />

          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            className="w-full bg-slate-800 rounded-xl px-5 py-4"
          />

          <input
            type="text"
            value={college}
            onChange={(e) => setCollege(e.target.value)}
            placeholder="College"
            className="w-full bg-slate-800 rounded-xl px-5 py-4"
          />

          <input
            type="text"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            placeholder="Branch"
            className="w-full bg-slate-800 rounded-xl px-5 py-4"
          />

          <input
            type="text"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            placeholder="LinkedIn URL"
            className="w-full bg-slate-800 rounded-xl px-5 py-4"
          />

          <input
            type="text"
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            placeholder="GitHub URL"
            className="w-full bg-slate-800 rounded-xl px-5 py-4"
          />

          <button
           onClick={saveProfile}
           className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold"
          >
               Save Changes
          </button>

        </div>

      </div>
    </main>
  );
}
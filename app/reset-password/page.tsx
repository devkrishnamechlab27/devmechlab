"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function updatePassword() {
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully!");

    router.push("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">

      <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-white mb-6">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New Password"
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          onClick={updatePassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold"
        >
          Update Password
        </button>

      </div>

    </main>
  );
}
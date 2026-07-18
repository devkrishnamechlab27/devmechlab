"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SecurityPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  async function updatePassword() {
    if (password !== confirm) {
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

    setPassword("");
    setConfirm("");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">

      <div className="bg-slate-900 rounded-2xl p-8 w-full max-w-md">

        <h1 className="text-3xl font-bold text-white mb-8">
          Change Password
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
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          onClick={updatePassword}
          className="w-full bg-blue-600 hover:bg-blue-700 p-4 rounded-xl text-white font-bold"
        >
          Update Password
        </button>

      </div>

    </main>
  );
}
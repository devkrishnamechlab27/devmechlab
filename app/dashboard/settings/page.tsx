"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function changePassword() {
    if (!password) {
      alert("Please enter a new password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Password updated successfully.");
      setPassword("");
    }
  }

  return (
    <main className="space-y-8">

      <div>
        <h1 className="text-4xl font-bold text-white">
          Settings
        </h1>

        <p className="text-gray-400 mt-2">
          Manage your account and preferences.
        </p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

        <h2 className="text-2xl font-bold mb-6">
          Security
        </h2>

        <label className="text-sm text-gray-400">
          New Password
        </label>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full mt-2 rounded-xl bg-slate-950 border border-slate-700 px-4 py-3"
        />

        <button
          onClick={changePassword}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-semibold"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>

      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">

        <h2 className="text-2xl font-bold">
          Preferences
        </h2>

        <div className="mt-6 space-y-4">

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Email Notifications
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Internship Notifications
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            Certificate Notifications
          </label>

        </div>

      </div>

    </main>
  );
}
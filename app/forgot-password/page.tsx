"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  async function resetPassword() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/reset-password",
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password reset link has been sent to your email.");
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">

      <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-white mb-6">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-4 rounded-xl bg-slate-800 text-white mb-6"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={resetPassword}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold"
        >
          Send Reset Link
        </button>

      </div>

    </main>
  );
}
"use client";


import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * Preserve the destination the user originally wanted.
   *
   * Example:
   * /login?redirect=%2Fcheckout%2Fsql
   *
   * becomes:
   * /checkout/sql
   */
  const redirectTo =
    searchParams.get("redirect") || "/dashboard";

  console.log("LOGIN REDIRECT TARGET:", redirectTo);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    /*
     * LOGIN
     */
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);

      console.error("LOGIN ERROR:", error);

      alert(error.message);
      return;
    }

    /*
     * CONFIRM SESSION
     */
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log("LOGIN SESSION:", session);

    if (sessionError || !session) {
      setLoading(false);

      console.error("SESSION ERROR:", sessionError);

      alert(
        "Login successful, but session could not be established."
      );

      return;
    }

    /*
     * REDIRECT TO ORIGINAL DESTINATION
     */
    console.log(
      "LOGIN SUCCESS → REDIRECTING TO:",
      redirectTo
    );

    router.replace(redirectTo);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 p-10 shadow-2xl">

        <h1 className="text-4xl font-bold text-center text-white">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mt-3">
          Login to DevMechLab
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-10 space-y-5"
        >
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          <div className="mt-4 text-center">
            <a
              href="/forgot-password"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
          Loading...
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
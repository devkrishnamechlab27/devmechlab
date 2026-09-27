"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /*
   * REMEMBER WHERE THE USER WANTED TO GO
   *
   * Example:
   * /login?redirect=%2Fcheckout%2Fsql
   *
   * becomes:
   * /checkout/sql
   */

  const redirectTo =
    searchParams.get("redirect") ||
    "/dashboard";

  console.log(
    "LOGIN REDIRECT TARGET:",
    redirectTo
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      /*
       * STEP 1
       * LOGIN
       */

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error(
          "LOGIN ERROR:",
          error
        );

        alert(error.message);
        return;
      }

      /*
       * STEP 2
       * GET CURRENT AUTHENTICATED USER
       *
       * We use getUser() instead of relying
       * only on the cached session.
       */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log(
        "LOGIN USER:",
        user
      );

      if (userError || !user) {
        console.error(
          "USER ERROR:",
          userError
        );

        alert(
          "Login successful, but user information could not be loaded."
        );

        return;
      }

      /*
       * STEP 3
       * COURSE CHECKOUT REDIRECT
       *
       * If login came from:
       *
       * /checkout/python-programming
       *
       * we must check whether the user already
       * owns that course before sending them
       * to checkout.
       */

      if (
        redirectTo.startsWith(
          "/checkout/"
        )
      ) {
        /*
         * GET COURSE SLUG
         */

        const courseSlug =
          redirectTo.replace(
            "/checkout/",
            ""
          );

        console.log(
          "LOGIN COURSE SLUG:",
          courseSlug
        );

        /*
         * GET COURSE
         */

        const {
          data: course,
          error: courseError,
        } = await supabase
          .from("courses")
          .select(
            "id, slug, price"
          )
          .eq(
            "slug",
            courseSlug
          )
          .maybeSingle();

        console.log(
          "LOGIN REDIRECT COURSE:",
          course
        );

        if (courseError) {
          console.error(
            "COURSE LOOKUP ERROR:",
            courseError
          );
        }

        /*
         * COURSE FOUND
         */

        if (course) {
          /*
           * CHECK EXISTING ENROLLMENT
           */

          const {
            data: enrollment,
            error:
              enrollmentError,
          } = await supabase
            .from("enrollments")
            .select("id")
            .eq(
              "user_id",
              user.id
            )
            .eq(
              "course_id",
              course.id
            )
            .maybeSingle();

          console.log(
            "LOGIN ENROLLMENT CHECK:",
            enrollment
          );

          if (
            enrollmentError
          ) {
            console.error(
              "LOGIN ENROLLMENT CHECK ERROR:",
              enrollmentError
            );
          }

          /*
           * ALREADY ENROLLED
           *
           * IMPORTANT:
           * Do NOT send the user to checkout.
           */

          if (enrollment) {
            console.log(
              "LOGIN SUCCESS → ALREADY ENROLLED → LEARNING"
            );

            router.replace(
              `/learn/${course.slug}`
            );

            router.refresh();

            return;
          }

          /*
           * NOT ENROLLED
           *
           * Continue to checkout.
           */

          console.log(
            "LOGIN SUCCESS → NOT ENROLLED → CHECKOUT"
          );

          router.replace(
            `/checkout/${course.slug}`
          );

          router.refresh();

          return;
        }
      }

      /*
       * STEP 4
       * NORMAL LOGIN
       *
       * If login did not originate from
       * a course checkout flow, preserve
       * the requested redirect.
       */

      console.log(
        "LOGIN SUCCESS → REDIRECTING TO:",
        redirectTo
      );

      router.replace(
        redirectTo
      );

      router.refresh();
    } catch (error) {
      console.error(
        "LOGIN PROCESS ERROR:",
        error
      );

      alert(
        "Something went wrong during login."
      );
    } finally {
      setLoading(false);
    }
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
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 text-white outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Signing In..."
              : "Login"}
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
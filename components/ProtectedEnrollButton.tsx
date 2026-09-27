"use client";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Props {
  href: string;
  courseId: number;
  slug: string;
}

export default function ProtectedEnrollButton({
  href,
  courseId,
  slug,
}: Props) {
  const router = useRouter();

  async function handleEnroll() {
    try {
      /*
       * STEP 1
       * GET CURRENT AUTHENTICATED USER
       *
       * We use getUser() instead of getSession()
       * so the routing decision uses the current
       * authenticated user.
       */

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("CURRENT USER:", user);
      console.log("USER ERROR:", userError);
      console.log("COURSE ID:", courseId);
      console.log("SLUG:", slug);

      /*
       * STEP 2
       * LOGIN CHECK
       */

      if (userError || !user) {
        const loginUrl = `/login?redirect=${encodeURIComponent(
          href
        )}`;

        console.log(
          "NOT LOGGED IN → REDIRECTING TO:",
          loginUrl
        );

        router.push(loginUrl);
        return;
      }

      /*
       * STEP 3
       * CHECK WHETHER USER IS ALREADY ENROLLED
       */

      const {
        data: enrollment,
        error: enrollmentError,
      } = await supabase
        .from("enrollments")
        .select("id")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .maybeSingle();

      console.log("ENROLLMENT:", enrollment);
      console.log(
        "ENROLLMENT ERROR:",
        enrollmentError
      );

      if (enrollmentError) {
        console.error(
          "ENROLLMENT CHECK ERROR:",
          enrollmentError
        );

        alert(
          "Unable to check your course enrollment. Please try again."
        );

        return;
      }

      /*
       * STEP 4
       * ALREADY ENROLLED
       *
       * This must ALWAYS take the user
       * directly to the learning page.
       */

      if (enrollment) {
        console.log(
          "ALREADY ENROLLED → OPENING LEARN PAGE"
        );

        router.push(`/learn/${slug}`);
        return;
      }

      /*
       * STEP 5
       * USER IS LOGGED IN BUT NOT ENROLLED
       *
       * Get the course price.
       */

      const {
        data: course,
        error: courseError,
      } = await supabase
        .from("courses")
        .select("id, slug, price")
        .eq("id", courseId)
        .maybeSingle();

      console.log("COURSE:", course);
      console.log(
        "COURSE ERROR:",
        courseError
      );

      if (courseError || !course) {
        console.error(
          "COURSE FETCH ERROR:",
          courseError
        );

        alert(
          "Unable to load course information."
        );

        return;
      }

      /*
       * STEP 6
       * CHECK COURSE PRICE
       */

      const coursePrice = String(course.price)
        .trim()
        .toUpperCase();

      console.log(
        "COURSE PRICE:",
        coursePrice
      );

      /*
       * STEP 7
       * FREE COURSE
       */

      if (coursePrice === "FREE") {
        console.log(
          "FREE COURSE → CREATING ENROLLMENT"
        );

        const {
          error: freeEnrollmentError,
        } = await supabase
          .from("enrollments")
          .insert({
            user_id: user.id,
            course_id: courseId,
          });

        if (freeEnrollmentError) {
          console.error(
            "FREE ENROLLMENT ERROR:",
            freeEnrollmentError
          );

          alert(
            "Unable to enroll in this course."
          );

          return;
        }

        console.log(
          "FREE COURSE ENROLLED SUCCESSFULLY"
        );

        router.push(`/learn/${slug}`);
        return;
      }

      /*
       * STEP 8
       * PAID COURSE
       *
       * User is logged in,
       * but there is no enrollment.
       *
       * Therefore → checkout.
       */

      console.log(
        "LOGGED IN + NOT ENROLLED + PAID COURSE → CHECKOUT"
      );

      router.push(href);
    } catch (error) {
      console.error(
        "CONTINUE / ENROLL ERROR:",
        error
      );

      alert(
        "Something went wrong. Please try again."
      );
    }
  }

  return (
    <button
      onClick={handleEnroll}
      className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition"
    >
      Continue / Enroll
    </button>
  );
}
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
    /*
     * GET SESSION
     */

    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("SESSION:", session);
    console.log("USER ID:", session?.user.id);
    console.log("COURSE ID:", courseId);
    console.log("SLUG:", slug);

    /*
     * LOGIN CHECK
     */

    if (!session) {
      router.push("/login");
      return;
    }

    /*
     * CHECK EXISTING ENROLLMENT
     */

    const {
      data: enrollment,
      error: enrollmentError,
    } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("course_id", courseId);

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
      return;
    }

    /*
     * ALREADY ENROLLED
     */

    if (enrollment && enrollment.length > 0) {
      console.log(
        "ALREADY ENROLLED → OPENING LEARN PAGE"
      );

      router.push(`/learn/${slug}`);
      return;
    }

    /*
     * GET COURSE
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
      return;
    }

    /*
     * CHECK COURSE PRICE
     */

    const coursePrice =
      String(course.price)
        .trim()
        .toUpperCase();

    console.log(
      "COURSE PRICE:",
      coursePrice
    );

    /*
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
          user_id: session.user.id,
          course_id: courseId,
        });

      if (freeEnrollmentError) {
        console.error(
          "FREE ENROLLMENT ERROR:",
          freeEnrollmentError
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
     * PAID COURSE
     */

    console.log(
      "PAID COURSE → CHECKOUT"
    );

    router.push(href);
  }

  /*
   * BUTTON
   */

  return (
    <button
      onClick={handleEnroll}
      className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition"
    >
      Continue / Enroll
    </button>
  );
}
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
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("SESSION:", session);
    console.log("USER ID:", session?.user.id);
    console.log("COURSE ID:", courseId);
    console.log("SLUG:", slug);

    if (!session) {
      router.push("/login");
      return;
    }

    const { data: enrollment, error } = await supabase
      .from("enrollments")
      .select("*")
      .eq("user_id", session.user.id)
      .eq("course_id", courseId);

    console.log("ENROLLMENT:", enrollment);
    console.log("ENROLLMENT ERROR:", error);

    if (enrollment && enrollment.length > 0) {
      console.log("ALREADY ENROLLED → OPENING LEARN PAGE");
      router.push(`/learn/${slug}`);
      return;
    }

    console.log("NOT ENROLLED → CHECKOUT");
    router.push(href);
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
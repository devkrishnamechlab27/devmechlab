"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface Props {
  href: string;
}

export default function ProtectedEnrollButton({ href }: Props) {
  const router = useRouter();

  async function handleEnroll() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push("/login");
      return;
    }

    router.push(href);
  }

  return (
    <button
      onClick={handleEnroll}
      className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition"
    >
      Enroll Now
    </button>
  );
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      await supabase.auth.signOut();
      router.replace("/login");
    }

    logout();
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
      Logging out...
    </main>
  );
}
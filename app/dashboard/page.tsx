"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import DashboardHeader from "@/app/components/DashboardHeader";
import CompletionBar from "@/app/components/CompletionBar";
import ProfileCard from "@/app/components/ProfileCard";
import StatsCards from "@/app/components/StatsCards";
import QuickActions from "@/app/components/QuickActions";

export default function DashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState("");

  const [fullName, setFullName] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setEmail(session.user.email ?? "");

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
        
        console.log("Dashboard Profile:", data);
        console.log("User ID:", session.user.id);

      if (data) {
        setFullName(data.full_name ?? "");
        setCollege(data.college ?? "");
        setBranch(data.branch ?? "");
        setPhone(data.phone ?? "");
      }

      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Loading Dashboard...
      </main>
    );
  }

  const completion =
    [fullName, college, branch, phone].filter(Boolean).length * 25;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-7xl mx-auto space-y-8">

        <DashboardHeader email={email} />

        <CompletionBar percentage={completion} />

        <ProfileCard
          fullName={fullName}
          college={college}
          branch={branch}
          phone={phone}
        />

        <StatsCards />

        <QuickActions />

      </div>

    </main>
  );
}
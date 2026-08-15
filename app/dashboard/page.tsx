"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

import DashboardHeader from "@/app/components/DashboardHeader";
import ProfileCard from "@/app/components/ProfileCard";
import StatsCards from "@/app/components/StatsCards";
import RecentActivity from "@/app/components/RecentActivity";
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
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setEmail(user.email ?? "");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
      }

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

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-7xl mx-auto space-y-8">

        <DashboardHeader fullName={fullName} />

        <ProfileCard
          fullName={fullName}
          email={email}
          college={college}
          branch={branch}
          phone={phone}
        />

        <StatsCards />

        <RecentActivity />

        <QuickActions />

      </div>
    </main>
  );
}
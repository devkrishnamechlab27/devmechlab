"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="h-screen bg-slate-950 text-white flex overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 min-w-0 flex flex-col">

        {/* TOPBAR */}
        <Topbar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        {/* ONLY MAIN CONTENT SCROLLS */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {children}
          </div>
        </div>

      </div>

    </main>
  );
}
"use client";

import {
  Menu,
  Bell,
} from "lucide-react";

interface TopbarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function Topbar({
  collapsed,
  setCollapsed,
}: TopbarProps) {
  return (
    <header className="h-20 shrink-0 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 lg:px-8">

      {/* LEFT */}
      <div className="flex items-center gap-4">

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 className="text-xl lg:text-2xl font-bold">
            Student Dashboard
          </h2>

          <p className="text-gray-400 text-sm">
            Welcome back 👋
          </p>
        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <button
          className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-gray-400 hover:text-white transition"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

        <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
          K
        </div>

      </div>

    </header>
  );
}
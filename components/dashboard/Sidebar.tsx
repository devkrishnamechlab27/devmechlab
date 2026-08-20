"use client";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Award,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/dashboard/my-courses",
    icon: BookOpen,
  },
  {
    title: "Internships",
    href: "/dashboard/internships",
    icon: Briefcase,
  },
  {
    title: "Certificates",
    href: "/dashboard/certificates",
    icon: Award,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

async function handleLogout() {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    router.replace("/login");
    router.refresh();
  }
}
  return (
    <aside
  className={`shrink-0 h-screen bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto transition-all duration-300 ${
    collapsed ? "w-[72px]" : "w-72"
  }`}
>
     <Link
  href="/"
  className={`flex items-center mb-8 ${
    collapsed ? "justify-center" : "justify-start"
  }`}
>
  <Image
    src="/logo.png"
    alt="DevMechLab"
    width={220}
    height={60}
    priority
    className={`object-contain transition-all duration-300 ${
      collapsed ? "h-10 w-10" : "h-16 w-auto"
    }`}
  />
</Link>

      <nav className="space-y-2">

        {menu.map((item) => {
          const Icon = item.icon;

          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
             className={`flex items-center rounded-xl py-3 transition ${
  collapsed
    ? "justify-center px-2"
    : "gap-3 px-4"
} ${
  active
    ? "bg-blue-600 text-white"
    : "hover:bg-slate-800 text-gray-300"
}`}
            >
              <Icon size={20} />

              {!collapsed && (
  <span className="whitespace-nowrap">
    {item.title}
  </span>
)}
            </Link>
          );
        })}

      </nav>
        <button
  onClick={() => setCollapsed(!collapsed)}
  className={`w-full flex items-center rounded-xl py-3 text-gray-400 hover:bg-slate-800 hover:text-white transition ${
    collapsed
      ? "justify-center px-2"
      : "gap-3 px-4"
  }`}
>
  {collapsed ? (
    <ChevronRight size={20} />
  ) : (
    <>
      <ChevronLeft size={20} />
      <span>Collapse Sidebar</span>
    </>
  )}
</button>
      <div className="mt-12 border-t border-slate-800 pt-6">

       <button
  onClick={handleLogout}
  className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
>
          <LogOut size={20} />
          {!collapsed && <span>Logout</span>}
        </button>

      </div>

    </aside>
  );
}
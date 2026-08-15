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

export default function Sidebar() {
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
    <aside className="w-72 bg-slate-900 border-r border-slate-800 min-h-screen p-6">

      <Link href="/">
                 <Image
  src="/logo.png"
  alt="DevMechLab"
  width={220}
  height={60}
  priority
  className="h-16 w-auto"
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
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition
              ${
                active
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 text-gray-300"
              }`}
            >
              <Icon size={20} />

              {item.title}
            </Link>
          );
        })}

      </nav>

      <div className="mt-12 border-t border-slate-800 pt-6">

       <button
  onClick={handleLogout}
  className="flex items-center gap-3 text-red-400 hover:text-red-300 transition"
>
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
  );
}
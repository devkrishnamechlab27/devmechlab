"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

const [loggedIn, setLoggedIn] = useState(false);

useEffect(() => {
  async function checkUser() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    setLoggedIn(!!session);
  }

  checkUser();

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setLoggedIn(!!session);
  });

  return () => subscription.unsubscribe();
}, []);

async function handleLogout() {
  await supabase.auth.signOut();
 router.replace("/");
 router.refresh();
}
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <Link href="/" className="text-3xl font-extrabold cursor-pointer">
          <span className="text-blue-500">Dev</span>
          <span className="text-white">Mech</span>
          <span className="text-orange-500">Lab</span>
        </Link>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8">

        <Link href="/"
       className={`transition ${
        pathname === "/"
        ? "text-blue-500 font-semibold"
        : "text-gray-300 hover:text-blue-400"
    }`}
  >
    Home
  </Link>

  <Link
    href="/courses"
    className={`transition ${
      pathname === "/courses"
        ? "text-blue-500 font-semibold"
        : "text-gray-300 hover:text-blue-400"
    }`}
  >
    Courses
  </Link>

  <Link
    href="/internships"
    className={`transition ${
      pathname === "/internships"
        ? "text-blue-500 font-semibold"
        : "text-gray-300 hover:text-blue-400"
    }`}
  >
    Internships
  </Link>

  <Link
    href="/certificates"
    className={`transition ${
      pathname === "/certificates"
        ? "text-blue-500 font-semibold"
        : "text-gray-300 hover:text-blue-400"
    }`}
  >
    Certificates
  </Link>

  <Link
    href="/about"
    className={`transition ${
      pathname === "/about"
        ? "text-blue-500 font-semibold"
        : "text-gray-300 hover:text-blue-400"
    }`}
  >
    About
  </Link>

  <Link
    href="/contact"
    className={`transition ${
      pathname === "/contact"
        ? "text-blue-500 font-semibold"
        : "text-gray-300 hover:text-blue-400"
    }`}
  >
    Contact
  </Link>

</div>

        {/* Button */}
       <div className="hidden md:flex items-center gap-3">
  {loggedIn ? (
    <>
      <Link
        href="/dashboard"
        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition"
      >
        Dashboard
      </Link>

      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition"
      >
        Logout
      </button>
    </>
  ) : (
    <>
      <Link
        href="/login"
        className="text-gray-300 hover:text-white transition"
      >
        Login
      </Link>

      <Link
        href="/signup"
        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition flex items-center gap-2"
      >
        <Rocket size={18} />
        Sign Up
      </Link>
    </>
  )}
</div>

      </nav>
    </header>
  );
}
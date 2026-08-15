"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Rocket, Menu, X, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const menuItems = [
    { title: "Home", href: "/" },
    { title: "Courses", href: "/courses" },
    { title: "Internships", href: "/internships" },
    { title: "Certificates", href: "/certificates" },
    { title: "About", href: "/about" },
    { title: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <nav className="max-w-9xl mx-auto flex items-center justify-between px-8 py-5">

          {/* Left */}
          <div className="flex items-center gap-7">
           
                 <Link href="/">
                <Image
  src="/logo.png"
  alt="DevMechLab"
  width={220}
  height={60}
  className="h-16 w-auto object-contain"
  priority
/>
                 </Link>

            <button
              onClick={() => setMenuOpen(true)}
              className="text-white hover:text-blue-400 transition"
            >
              <Menu size={28} />
            </button>

          </div>

{/* Right */}

<div className="flex items-center gap-5">

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

      <Link
        href="/cart"
        className="relative text-gray-300 hover:text-white transition"
      >
        <ShoppingCart size={24} />

        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          0
        </span>
      </Link>
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
        className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold flex items-center gap-2 transition"
      >
        <Rocket size={18} />
        Sign Up
      </Link>

      <Link
        href="/cart"
        className="relative text-gray-300 hover:text-white transition"
      >
        <ShoppingCart size={24} />

        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
          0
        </span>
      </Link>
    </>
  )}

</div>

        </nav>
      </header>

      {/* Overlay */}

      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed top-0 left-0 h-screen w-80 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-800">

          <h2 className="text-2xl font-bold">
            <span className="text-blue-500">Dev</span>
            <span className="text-white">Mech</span>
            <span className="text-orange-500">Lab</span>
          </h2>

          <button
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-red-400"
          >
            <X size={28} />
          </button>

        </div>

        <div className="flex flex-col p-6 space-y-5">

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`text-lg transition ${
                pathname === item.href
                  ? "text-blue-500 font-semibold"
                  : "text-gray-300 hover:text-blue-400"
              }`}
            >
              {item.title}
            </Link>
          ))}

        </div>

      </aside>
    </>
  );
}
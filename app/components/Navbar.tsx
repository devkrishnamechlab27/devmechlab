"use client";

import { Rocket } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">

      <nav className="max-w-7xl mx-auto flex items-center justify-between px-8 py-5">

        {/* Logo */}
        <h1 className="text-3xl font-extrabold cursor-pointer">
          <span className="text-blue-500">Dev</span>
          <span className="text-white">Mech</span>
          <span className="text-orange-500">Lab</span>
        </h1>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">

          <a href="#" className="hover:text-blue-400 transition">
            Home
          </a>

          <a href="#" className="hover:text-blue-400 transition">
            Courses
          </a>

          <a href="#" className="hover:text-blue-400 transition">
            Internship
          </a>

          <a href="#" className="hover:text-blue-400 transition">
            Certificates
          </a>

          <a href="#" className="hover:text-blue-400 transition">
            Contact
          </a>

        </div>

        {/* Button */}
        <button className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl transition-all hover:scale-105 font-semibold">

          <Rocket size={18} />

          Get Started

        </button>

      </nav>

    </header>
  );
}
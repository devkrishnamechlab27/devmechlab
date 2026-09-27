"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rocket, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-orange-500/20 blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-blue-500 font-semibold tracking-wider uppercase">
            Welcome to DevMechLab
          </p>

          <h2 className="mt-5 text-6xl font-extrabold leading-tight">
            Learn.
            <span className="text-blue-500"> Design.</span>
            <span className="text-orange-500"> Manufacture.</span>
          </h2>

          <p className="mt-8 text-xl text-gray-400 leading-9 max-w-2xl">
            India's Engineering Learning Platform dedicated to
            Mechanical Engineering, CAD/CAM, CNC Programming,
            SolidWorks, ANSYS, Industrial Refrigeration,
            Cryogenics, Python, SQL and emerging technologies.
          </p>

         <div className="flex flex-wrap gap-5 mt-8">

  <Link
    href="/courses"
    className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3"
  >
    🚀 Explore Courses
  </Link>

  <Link
    href="/watch-demo"
    className="border border-white hover:bg-white hover:text-slate-950 transition px-8 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3"
  >
    ▶ Watch Demo
  </Link>

</div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="relative w-full max-w-md h-96 rounded-3xl bg-gradient-to-br from-blue-600 via-slate-800 to-orange-500 flex items-center justify-center shadow-2xl border border-slate-700">

            <div className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-sm"></div>

            <div className="relative text-center px-8">

              <div className="text-7xl mb-5">
                ⚙️
              </div>

              <h2 className="text-4xl font-bold">
                DevMechLab
              </h2>

              <p className="mt-4 text-gray-200">
                Engineering Learning Platform
              </p>

              <p className="mt-6 text-sm text-gray-300">
                CAD • CNC • ANSYS • Cryogenics • Manufacturing
              </p>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
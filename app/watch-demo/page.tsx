import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Award,
  BriefcaseBusiness,
  CheckCircle2,
  PlayCircle,
  ShieldCheck,
  Smartphone,
  GraduationCap,
  Users,
  Code2,
  Cpu,
  Snowflake,
} from "lucide-react";

export default function WatchDemoPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden border-b border-slate-800">

        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-8 py-24">

          <div className="max-w-4xl">

            <p className="text-blue-400 font-semibold tracking-widest uppercase">
              DevMechLab Platform Demo
            </p>

            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mt-5">
              See How{" "}
              <span className="text-blue-500">
                DevMechLab
              </span>{" "}
              Works.
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 leading-relaxed mt-8 max-w-3xl">
              A practical engineering learning platform designed to help
              students learn, practice, build projects and earn verified
              certificates.
            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/courses"
                className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-bold text-lg"
              >
                <BookOpen size={22} />
                Explore Courses
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/internships"
                className="inline-flex items-center gap-3 border border-slate-600 hover:border-blue-500 hover:bg-slate-900 transition px-8 py-4 rounded-xl font-bold text-lg"
              >
                <BriefcaseBusiness size={22} />
                Explore Internships
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          PLATFORM OVERVIEW
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="text-center max-w-3xl mx-auto">

          <p className="text-orange-500 font-semibold">
            PLATFORM OVERVIEW
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            One Platform. Multiple Engineering Paths.
          </h2>

          <p className="text-gray-400 text-lg mt-5">
            DevMechLab brings technical learning, internships,
            practical projects and certification together in one place.
          </p>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

          {/* Courses */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-blue-500 transition">

            <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
              <BookOpen className="text-blue-400" size={28} />
            </div>

            <h3 className="text-xl font-bold mt-6">
              Engineering Courses
            </h3>

            <p className="text-gray-400 mt-3 leading-6">
              Learn CAD, CNC, ANSYS, refrigeration,
              programming and other engineering skills.
            </p>

          </div>


          {/* Internships */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-orange-500 transition">

            <div className="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <BriefcaseBusiness
                className="text-orange-400"
                size={28}
              />
            </div>

            <h3 className="text-xl font-bold mt-6">
              Internships
            </h3>

            <p className="text-gray-400 mt-3 leading-6">
              Gain practical exposure through structured
              engineering internship programs.
            </p>

          </div>


          {/* Projects */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-green-500 transition">

            <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Cpu className="text-green-400" size={28} />
            </div>

            <h3 className="text-xl font-bold mt-6">
              Practical Projects
            </h3>

            <p className="text-gray-400 mt-3 leading-6">
              Apply concepts through practical assignments
              and industry-oriented projects.
            </p>

          </div>


          {/* Certificates */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 hover:border-yellow-500 transition">

            <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Award className="text-yellow-400" size={28} />
            </div>

            <h3 className="text-xl font-bold mt-6">
              Certificates
            </h3>

            <p className="text-gray-400 mt-3 leading-6">
              Complete your learning journey and receive
              DevMechLab certificates.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="bg-slate-900/60 border-y border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-20">

          <div className="text-center">

            <p className="text-blue-400 font-semibold">
              HOW IT WORKS
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Your Learning Journey
            </h2>

          </div>


          <div className="grid md:grid-cols-5 gap-6 mt-14">

            {[
              {
                number: "01",
                title: "Explore",
                text: "Browse engineering courses and internships.",
              },
              {
                number: "02",
                title: "Enroll",
                text: "Choose a program and complete enrollment.",
              },
              {
                number: "03",
                title: "Learn",
                text: "Watch lessons and study the learning material.",
              },
              {
                number: "04",
                title: "Practice",
                text: "Work on assignments and practical projects.",
              },
              {
                number: "05",
                title: "Certify",
                text: "Complete your program and receive your certificate.",
              },
            ].map((step) => (

              <div
                key={step.number}
                className="relative bg-slate-950 border border-slate-800 rounded-2xl p-6"
              >

                <span className="text-blue-500 text-sm font-bold">
                  STEP {step.number}
                </span>

                <h3 className="text-2xl font-bold mt-4">
                  {step.title}
                </h3>

                <p className="text-gray-400 mt-3 leading-6">
                  {step.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          LEARNING EXPERIENCE
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          <div>

            <p className="text-orange-500 font-semibold">
              LEARNING EXPERIENCE
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Learn Engineering Skills That Matter.
            </h2>

            <p className="text-gray-400 text-lg mt-6 leading-8">
              DevMechLab focuses on technical skills that connect
              engineering theory with practical applications.
            </p>


            <div className="mt-8 space-y-5">

              {[
                "Structured engineering lessons",
                "Practical learning resources",
                "Assignments and project-based learning",
                "Mechanical engineering software skills",
                "Industry-oriented internship programs",
                "Certificate after successful completion",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-start gap-4"
                >

                  <CheckCircle2
                    className="text-green-400 mt-1 flex-shrink-0"
                    size={22}
                  />

                  <p className="text-gray-300">
                    {item}
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* Demo UI */}

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">

            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">

              {/* Fake dashboard header */}

              <div className="border-b border-slate-800 p-5 flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    MY LEARNING
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    Engineering Dashboard
                  </h3>

                </div>

                <GraduationCap
                  className="text-blue-500"
                  size={32}
                />

              </div>


              {/* Course */}

              <div className="p-6">

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

                  <div className="flex items-center gap-4">

                    <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center">
                      <Cpu
                        className="text-blue-400"
                        size={24}
                      />
                    </div>

                    <div>

                      <h4 className="font-bold">
                        Industrial Refrigeration
                      </h4>

                      <p className="text-gray-500 text-sm">
                        Refrigeration • Cryogenics • HVAC
                      </p>

                    </div>

                  </div>


                  <div className="mt-6">

                    <div className="flex justify-between text-sm mb-2">

                      <span className="text-gray-400">
                        Course Progress
                      </span>

                      <span className="text-blue-400">
                        72%
                      </span>

                    </div>

                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: "72%" }}
                      />

                    </div>

                  </div>


                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <div className="bg-slate-950 rounded-lg p-4">

                      <p className="text-gray-500 text-xs">
                        Lessons
                      </p>

                      <p className="text-xl font-bold mt-1">
                        24
                      </p>

                    </div>

                    <div className="bg-slate-950 rounded-lg p-4">

                      <p className="text-gray-500 text-xs">
                        Completed
                      </p>

                      <p className="text-xl font-bold mt-1">
                        17
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ENGINEERING DOMAINS
      ===================================================== */}

      <section className="bg-slate-900/60 border-y border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-20">

          <div className="text-center max-w-3xl mx-auto">

            <p className="text-blue-400 font-semibold">
              ENGINEERING DOMAINS
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Built Around Engineering.
            </h2>

            <p className="text-gray-400 mt-5">
              Explore technical areas covered by the DevMechLab
              learning ecosystem.
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">

              <Code2
                className="text-blue-400"
                size={30}
              />

              <h3 className="text-xl font-bold mt-5">
                CAD & Design
              </h3>

              <p className="text-gray-400 mt-3">
                AutoCAD, SolidWorks and mechanical design skills.
              </p>

            </div>


            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">

              <Cpu
                className="text-orange-400"
                size={30}
              />

              <h3 className="text-xl font-bold mt-5">
                Simulation
              </h3>

              <p className="text-gray-400 mt-3">
                ANSYS and engineering simulation concepts.
              </p>

            </div>


            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">

              <BriefcaseBusiness
                className="text-green-400"
                size={30}
              />

              <h3 className="text-xl font-bold mt-5">
                Manufacturing
              </h3>

              <p className="text-gray-400 mt-3">
                CNC programming and manufacturing-oriented skills.
              </p>

            </div>


            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">

              <Snowflake
                className="text-cyan-400"
                size={30}
              />

              <h3 className="text-xl font-bold mt-5">
                Refrigeration & Cryogenics
              </h3>

              <p className="text-gray-400 mt-3">
                Industrial refrigeration, cryogenics and HVAC.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          CERTIFICATION
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="bg-gradient-to-r from-blue-600/20 via-slate-900 to-orange-500/20 border border-slate-800 rounded-3xl p-10 md:p-14">

          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div>

              <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center">

                <Award
                  className="text-yellow-400"
                  size={34}
                />

              </div>

              <h2 className="text-4xl font-bold mt-6">
                Complete. Earn. Verify.
              </h2>

              <p className="text-gray-400 text-lg mt-5 leading-7">
                Successfully complete your DevMechLab learning
                program and receive a certificate associated with
                your achievement.
              </p>

            </div>


            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-7">

              <div className="flex items-center gap-4">

                <ShieldCheck
                  className="text-green-400"
                  size={32}
                />

                <div>

                  <h3 className="font-bold text-xl">
                    Verified Learning
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Certificate and learning records
                  </p>

                </div>

              </div>


              <div className="mt-7 space-y-4">

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Course
                  </span>

                  <span className="font-semibold">
                    Completed
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Progress
                  </span>

                  <span className="text-green-400 font-semibold">
                    100%
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-500">
                    Certificate
                  </span>

                  <span className="text-blue-400 font-semibold">
                    Available
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ACCESSIBILITY / DEVICE
      ===================================================== */}

      <section className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-16">

          <div className="flex flex-col md:flex-row items-center justify-between gap-8">

            <div className="flex items-center gap-5">

              <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center">

                <Smartphone
                  className="text-blue-400"
                  size={28}
                />

              </div>

              <div>

                <h3 className="text-xl font-bold">
                  Learn Anywhere
                </h3>

                <p className="text-gray-500 mt-1">
                  Access your learning experience from desktop
                  and mobile devices.
                </p>

              </div>

            </div>


            <Users
              className="text-slate-700"
              size={70}
            />

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-orange-500/10 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-8 py-24 text-center">

          <p className="text-blue-400 font-semibold tracking-widest">
            START YOUR ENGINEERING JOURNEY
          </p>

          <h2 className="text-4xl md:text-6xl font-extrabold mt-5">
            Learn. Design. Manufacture.
          </h2>

          <p className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto">
            Explore DevMechLab courses and internships designed
            around practical engineering skills.
          </p>

          <div className="flex flex-wrap justify-center gap-5 mt-10">

            <Link
              href="/courses"
              className="inline-flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl font-bold text-lg"
            >
              <BookOpen size={22} />
              Explore Courses
              <ArrowRight size={20} />
            </Link>

            <Link
              href="/internships"
              className="inline-flex items-center gap-3 border border-slate-600 hover:border-orange-500 hover:bg-slate-900 transition px-8 py-4 rounded-xl font-bold text-lg"
            >
              <BriefcaseBusiness size={22} />
              Explore Internships
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
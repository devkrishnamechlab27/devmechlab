export default function AboutPage() {
  const domains = [
    {
      icon: "⚙️",
      title: "Mechanical Engineering",
      description:
        "Build strong foundations in mechanical engineering concepts, applications, and industry practices.",
    },
    {
      icon: "📐",
      title: "CAD/CAM & SolidWorks",
      description:
        "Learn 2D drafting, 3D modelling, assemblies, engineering drawings, and modern design workflows.",
    },
    {
      icon: "🏭",
      title: "CNC & Manufacturing",
      description:
        "Develop practical knowledge of CNC programming, machining, manufacturing processes, and production.",
    },
    {
      icon: "🔬",
      title: "ANSYS & Simulation",
      description:
        "Explore engineering simulation through CFD, FEA, thermal analysis, and practical engineering problems.",
    },
    {
      icon: "❄️",
      title: "Refrigeration & Cryogenics",
      description:
        "Learn refrigeration, HVAC, industrial refrigeration, cryogenics, and their engineering applications.",
    },
    {
      icon: "💻",
      title: "Programming & Data",
      description:
        "Develop engineering-focused skills in Python, SQL, automation, data analysis, and computational tools.",
    },
    {
      icon: "🤖",
      title: "AI & Emerging Technologies",
      description:
        "Understand how artificial intelligence and emerging technologies can be applied to modern engineering.",
    },
  ];

  const features = [
    {
      icon: "🎯",
      title: "Industry-Oriented Learning",
      description:
        "Learning focused on practical engineering skills and real-world applications.",
    },
    {
      icon: "🛠️",
      title: "Practical Projects",
      description:
        "Apply concepts through projects that connect engineering theory with practice.",
    },
    {
      icon: "💻",
      title: "Modern Engineering Tools",
      description:
        "Learn software and technologies used across design, manufacturing, simulation, and automation.",
    },
    {
      icon: "📜",
      title: "QR Verified Certificates",
      description:
        "Certificates designed with verification in mind for completed learning and internship programs.",
    },
    {
      icon: "🚀",
      title: "Internship & Career Development",
      description:
        "Gain practical exposure and develop skills that support your engineering career journey.",
    },
    {
      icon: "🤖",
      title: "Engineering + AI",
      description:
        "Explore the intersection of mechanical engineering, programming, automation, and AI.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-slate-950 to-orange-950/20" />

        <div className="relative max-w-7xl mx-auto px-8 py-24 md:py-32">

          <p className="text-blue-400 font-semibold text-lg">
            ABOUT DEVMECHLAB
          </p>

          <h1 className="mt-5 text-5xl md:text-7xl font-extrabold leading-tight">
            Engineering.
            <br />
            <span className="text-blue-500">Technology.</span>
            <br />
            <span className="text-orange-500">Innovation.</span>
          </h1>

          <p className="mt-8 max-w-3xl text-lg md:text-xl text-gray-400 leading-8">
            DevMechLab is an engineering learning platform focused on
            practical skills, modern engineering tools, and emerging
            technologies for the next generation of engineers.
          </p>

        </div>
      </section>


      {/* WHAT IS DEVMECHLAB */}
      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="max-w-4xl">

          <p className="text-orange-500 font-semibold">
            WHO WE ARE
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            What is{" "}
            <span className="text-blue-500">
              DevMechLab
            </span>
            ?
          </h2>

          <p className="mt-7 text-gray-400 text-lg leading-8">
            DevMechLab is built to connect engineering education with
            practical industry-oriented skills. Our platform brings
            together mechanical engineering, engineering software,
            manufacturing, simulation, programming, and emerging
            technologies in one learning ecosystem.
          </p>

          <p className="mt-5 text-gray-400 text-lg leading-8">
            From CAD and SolidWorks to CNC programming, ANSYS,
            industrial refrigeration, cryogenics, Python, SQL, and
            AI, DevMechLab aims to help learners continuously develop
            the technical skills required in a changing engineering
            industry.
          </p>

        </div>

      </section>


      {/* ENGINEERING DOMAINS */}
      <section className="bg-slate-900/50 border-y border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-20">

          <div className="text-center max-w-3xl mx-auto">

            <p className="text-blue-400 font-semibold">
              OUR ENGINEERING DOMAINS
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Learn Across Multiple
              <span className="text-orange-500">
                {" "}Engineering Fields
              </span>
            </h2>

            <p className="mt-5 text-gray-400 text-lg">
              Explore technical skills spanning mechanical engineering,
              manufacturing, simulation, programming, and emerging
              technologies.
            </p>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">

            {domains.map((domain) => (
              <div
                key={domain.title}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-7 hover:border-blue-500/60 hover:-translate-y-1 transition-all duration-300"
              >

                <div className="text-4xl">
                  {domain.icon}
                </div>

                <h3 className="text-xl font-bold mt-5">
                  {domain.title}
                </h3>

                <p className="text-gray-400 mt-3 leading-7">
                  {domain.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* MISSION */}
      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="bg-gradient-to-r from-blue-950/60 to-slate-900 border border-blue-900/40 rounded-3xl p-8 md:p-14">

          <p className="text-orange-500 font-semibold">
            OUR MISSION
          </p>

          <h2 className="text-3xl md:text-4xl font-bold mt-3">
            Bridging Engineering Education
            <span className="text-blue-500">
              {" "}and Industry Skills
            </span>
          </h2>

          <p className="mt-6 max-w-4xl text-gray-300 text-lg leading-8">
            Our mission is to bridge the gap between engineering
            education and industry requirements by providing
            practical, technology-driven learning for aspiring
            engineers, students, and professionals.
          </p>

        </div>

      </section>


      {/* WHY DEVMECHLAB */}
      <section className="bg-slate-900/50 border-y border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-20">

          <div className="text-center">

            <p className="text-orange-500 font-semibold">
              WHY DEVMECHLAB
            </p>

            <h2 className="text-4xl md:text-5xl font-bold mt-3">
              Built for the{" "}
              <span className="text-blue-500">
                Modern Engineer
              </span>
            </h2>

          </div>


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-7"
              >

                <div className="text-3xl">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold mt-5">
                  {feature.title}
                </h3>

                <p className="text-gray-400 mt-3 leading-7">
                  {feature.description}
                </p>

              </div>
            ))}

          </div>

        </div>

      </section>


      {/* FOUNDER */}
      <section className="max-w-7xl mx-auto px-8 py-20">

        <div className="max-w-4xl mx-auto text-center">

          <p className="text-blue-400 font-semibold">
            FOUNDER
          </p>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            K.K. Ranjan
          </h2>

          <p className="text-orange-500 font-semibold text-lg mt-2">
            Founder & CEO, DevMechLab
          </p>

          <p className="text-gray-400 text-lg leading-8 mt-6">
            DevMechLab was created with the vision of building a
            practical engineering learning ecosystem where learners
            can develop technical skills, explore modern engineering
            technologies, and prepare themselves for real-world
            opportunities.
          </p>

        </div>

      </section>


      {/* CTA */}
      <section className="border-t border-slate-800">

        <div className="max-w-7xl mx-auto px-8 py-20 text-center">

          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Build Your
            <span className="text-blue-500">
              {" "}Engineering Future?
            </span>
          </h2>

          <p className="mt-5 text-gray-400 text-lg">
            Explore our courses and internships and start building
            practical engineering skills.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

            <a
              href="/courses"
              className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-bold transition"
            >
              Explore Courses
            </a>

            <a
              href="/internships"
              className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl font-bold transition"
            >
              Explore Internships
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}
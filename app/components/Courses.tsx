import {
  PenTool,
  Box,
  Cpu,
  Snowflake,
  Settings,
  Code2,
  ArrowRight,
} from "lucide-react";

const courses = [
  {
    title: "AutoCAD Mastery",
    description: "2D & 3D drafting from beginner to advanced.",
    icon: PenTool,
    level: "Beginner",
    duration: "6 Weeks",
    rating: "4.9",
  },
  {
    title: "SolidWorks Complete",
    description: "Part, Assembly, Drawing & Simulation.",
    icon: Box,
    level: "Intermediate",
    duration: "8 Weeks",
    rating: "4.8",
  },
  {
    title: "ANSYS Simulation",
    description: "Structural, Thermal & CFD Analysis.",
    icon: Cpu,
    level: "Advanced",
    duration: "10 Weeks",
    rating: "4.9",
  },
  {
    title: "Industrial Refrigeration",
    description: "Refrigeration, Cryogenics & HVAC.",
    icon: Snowflake,
    level: "Advanced",
    duration: "8 Weeks",
    rating: "5.0",
  },
  {
    title: "CNC Programming",
    description: "CAM, G-Code & Manufacturing.",
    icon: Settings,
    level: "Intermediate",
    duration: "6 Weeks",
    rating: "4.8",
  },
  {
    title: "Python for Engineers",
    description: "Automation, Data Analysis & AI.",
    icon: Code2,
    level: "Beginner",
    duration: "5 Weeks",
    rating: "4.9",
  },
];

export default function Courses() {
  return (
    <section className="bg-slate-950 text-white py-24 px-8">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center">
          Featured <span className="text-blue-500">Courses</span>
        </h2>

        <p className="text-center text-gray-400 mt-4 mb-14">
          Learn industry-ready engineering skills from expert instructors.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {courses.map((course, index) => {
            const Icon = course.icon;

            return (
              <div
                key={index}
                className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 shadow-lg"
              >
                <Icon className="text-blue-400" size={42} />

                <h3 className="text-2xl font-bold mt-5">
                  {course.title}
                </h3>

                <div className="flex justify-between text-sm text-gray-400 mt-3">
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                </div>

                <p className="mt-5 text-gray-400">
                  {course.description}
                </p>

                <div className="mt-6 space-y-2 text-sm text-gray-300">
                  <p>✅ Certificate Included</p>
                  <p>✅ Hands-on Projects</p>
                  <p>⭐ {course.rating} Rating</p>
                </div>

                <button className="mt-8 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold transition">
                  Enroll Now
                  <ArrowRight size={18} />
                </button>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
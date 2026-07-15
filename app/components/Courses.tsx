const courses = [
  {
    icon: "🖥️",
    title: "AutoCAD Mastery",
    level: "Beginner",
    duration: "8 Weeks",
    rating: "4.9",
    description: "Learn 2D & 3D drafting used in industry.",
  },
  {
    icon: "⚙️",
    title: "SolidWorks Complete",
    level: "Intermediate",
    duration: "10 Weeks",
    rating: "4.8",
    description: "Part, Assembly, Drawing & Simulation.",
  },
  {
    icon: "🔬",
    title: "ANSYS Simulation",
    level: "Advanced",
    duration: "12 Weeks",
    rating: "4.9",
    description: "Structural, Thermal & CFD Analysis.",
  },
  {
    icon: "❄️",
    title: "Industrial Refrigeration",
    level: "Advanced",
    duration: "8 Weeks",
    rating: "5.0",
    description: "Refrigeration, HVAC & Cryogenics.",
  },
  {
    icon: "🤖",
    title: "CNC Programming",
    level: "Intermediate",
    duration: "6 Weeks",
    rating: "4.8",
    description: "CAM, G-Code & Manufacturing.",
  },
  {
    icon: "🐍",
    title: "Python for Engineers",
    level: "Beginner",
    duration: "6 Weeks",
    rating: "4.9",
    description: "Automation, AI & Data Analysis.",
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

          {courses.map((course, index) => (

            <div
              key={index}
              className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-blue-500 hover:-translate-y-2 transition-all duration-300 shadow-lg"
            >

              <div className="text-5xl">
                {course.icon}
              </div>

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

              <button className="mt-8 w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-semibold transition">
                Enroll Now
              </button>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
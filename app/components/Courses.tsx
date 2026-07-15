export default function Courses() {
  const courses = [
    {
      title: "AutoCAD Mastery",
      description: "2D & 3D drafting from beginner to advanced.",
    },
    {
      title: "SolidWorks Complete",
      description: "Part, Assembly, Drawing & Simulation.",
    },
    {
      title: "ANSYS Simulation",
      description: "Structural, Thermal & CFD analysis.",
    },
    {
      title: "Industrial Refrigeration",
      description: "Refrigeration, Cryogenics & HVAC.",
    },
    {
      title: "CNC Programming",
      description: "CAM, G-Code, Manufacturing Processes.",
    },
    {
      title: "Python for Engineers",
      description: "Automation, Data Analysis & AI Basics.",
    },
  ];

  return (
    <section className="bg-slate-950 text-white py-20 px-8">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center">
          Featured <span className="text-blue-500">Courses</span>
        </h2>

        <p className="text-center text-gray-400 mt-4 mb-12">
          Learn the most in-demand engineering skills from industry experts.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={index}
              className="bg-slate-900 rounded-2xl p-8 hover:scale-105 transition duration-300 border border-slate-800"
            >
              <h3 className="text-2xl font-bold mb-4 text-blue-400">
                {course.title}
              </h3>

              <p className="text-gray-400">
                {course.description}
              </p>

              <button className="mt-6 bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-lg font-semibold">
                Learn More
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
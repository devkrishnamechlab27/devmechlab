const internships = [
  {
    title: "Mechanical Design Internship",
    duration: "8 Weeks",
    mode: "Online",
    certificate: "QR Verified",
  },
  {
    title: "Industrial Refrigeration & Cryogenics",
    duration: "10 Weeks",
    mode: "Hybrid",
    certificate: "QR Verified",
  },
  {
    title: "CAD/CAM & CNC Programming",
    duration: "6 Weeks",
    mode: "Online",
    certificate: "QR Verified",
  },
];

export default function Internship() {
  return (
    <section className="bg-slate-900 text-white py-24 px-8">
      <div className="max-w-7xl mx-auto">

        <h2 className="text-5xl font-bold text-center">
          Internship <span className="text-orange-500">Programs</span>
        </h2>

        <p className="text-center text-gray-400 mt-4 mb-14">
          Work on real engineering projects and earn industry-recognized certificates.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {internships.map((item, index) => (

            <div
              key={index}
              className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-orange-500 hover:-translate-y-2 transition-all duration-300 shadow-lg"
            >

              <div className="text-5xl mb-5">
                💼
              </div>

              <h3 className="text-2xl font-bold">
                {item.title}
              </h3>

              <div className="mt-5 space-y-2 text-gray-300">
                <p>📅 {item.duration}</p>
                <p>🌐 {item.mode}</p>
                <p>📜 {item.certificate}</p>
              </div>

              <div className="mt-6 space-y-2 text-gray-300">
                <p>✅ Live Projects</p>
                <p>✅ Mentor Support</p>
                <p>✅ Letter of Recommendation</p>
                <p>✅ Placement Guidance</p>
              </div>

              <button className="mt-8 w-full bg-blue-600 hover:bg-blue-700 transition py-3 rounded-xl font-semibold">
                Apply Now
              </button>

            </div>

          ))}

        </div>

      </div>
    </section>
  );
}
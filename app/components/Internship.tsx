export default function Internship() {
  return (
    <section className="bg-slate-900 text-white py-20 px-8">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h2 className="text-5xl font-bold">
            Engineering
            <span className="text-orange-500"> Internship </span>
            Programs
          </h2>

          <p className="mt-6 text-gray-400 text-lg leading-8">
            Gain real-world industrial experience through
            project-based internships designed for Mechanical,
            CAD, CNC, Manufacturing, Refrigeration &
            Cryogenics students.
          </p>

          <ul className="mt-8 space-y-4 text-lg">

            <li>✅ Live Industry Projects</li>

            <li>✅ Internship Certificate</li>

            <li>✅ Letter of Recommendation</li>

            <li>✅ QR Verified Certificates</li>

            <li>✅ Placement Guidance</li>

          </ul>

          <button className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold">
            Apply for Internship
          </button>

        </div>

        <div className="bg-slate-800 rounded-2xl p-12 text-center">

          <h3 className="text-3xl font-bold text-blue-400">
            500+
          </h3>

          <p className="text-gray-400 mt-3">
            Students trained through
            Industry Projects
          </p>

        </div>

      </div>

    </section>
  );
}
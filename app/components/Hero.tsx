export default function Hero() {
  return (
    <section className="bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Side */}
        <div>

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

          <div className="mt-10 flex flex-wrap gap-5">

            <button className="bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl text-lg font-semibold">
              Explore Courses
            </button>

            <button className="border border-white hover:bg-white hover:text-slate-900 transition px-8 py-4 rounded-xl text-lg">
              Watch Demo
            </button>

          </div>
          
        </div>
        
        {/* Right Side */}
        <div className="flex justify-center">

          <div className="w-full max-w-md h-96 rounded-3xl bg-gradient-to-br from-blue-600 via-slate-800 to-orange-500 flex items-center justify-center shadow-2xl">

            <div className="text-center">

              <h2 className="text-3xl font-bold">
                DevMechLab
              </h2>

              <p className="mt-4 text-gray-200">
                Engineering Learning Platform
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
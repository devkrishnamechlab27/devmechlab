export default function Hero() {
  return (
    <section className="text-center py-28 bg-slate-950 text-white">

      <h2 className="text-6xl font-extrabold">
        Learn.
        <span className="text-blue-500"> Design.</span>
        <span className="text-orange-500"> Manufacture.</span>
      </h2>

      <p className="mt-8 text-xl text-gray-400 max-w-3xl mx-auto">
        India's Engineering Learning Platform for Mechanical,
        CAD, CNC, Programming, ANSYS,
        Industrial Refrigeration & Cryogenics.
      </p>

      <div className="mt-10">
        <button className="bg-blue-600 px-8 py-4 rounded-xl mr-5">
          Explore Courses
        </button>

        <button className="border border-white px-8 py-4 rounded-xl">
          Watch Demo
        </button>
      </div>

    </section>
  );
}
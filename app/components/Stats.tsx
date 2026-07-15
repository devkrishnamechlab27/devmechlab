export default function Stats() {
  return (
    <section className="bg-slate-900 py-16">

      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 text-center">

        <div>
          <h2 className="text-5xl font-bold text-blue-500">20+</h2>
          <p className="text-gray-400 mt-2">Professional Courses</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-orange-500">1000+</h2>
          <p className="text-gray-400 mt-2">Students</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-blue-500">50+</h2>
          <p className="text-gray-400 mt-2">Industry Projects</p>
        </div>

        <div>
          <h2 className="text-5xl font-bold text-orange-500">100%</h2>
          <p className="text-gray-400 mt-2">QR Verified Certificates</p>
        </div>

      </div>
    </section>
  );
}
export default function ContinueLearning() {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mt-8">

      <h2 className="text-2xl font-bold">
        Continue Learning
      </h2>

      <p className="text-gray-400 mt-2">
        Cryogenic Engineering
      </p>

      <div className="mt-6">

        <div className="flex justify-between mb-2">
          <span>Progress</span>

          <span>35%</span>
        </div>

        <div className="h-3 rounded-full bg-slate-700 overflow-hidden">

          <div
            className="h-full bg-blue-500"
            style={{
              width: "35%",
            }}
          />

        </div>

      </div>

      <button className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition">
        Continue Course →
      </button>

    </section>
  );
}
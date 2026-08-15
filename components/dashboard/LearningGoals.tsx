export default function LearningGoals() {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Learning Goals
      </h2>

      <div className="space-y-6">

        <div>
          <p className="font-semibold">
            Today's Goal
          </p>

          <p className="text-gray-400 mt-2">
            Finish Lesson 3
          </p>
        </div>

        <div>
          <p className="font-semibold">
            Weekly Goal
          </p>

          <p className="text-gray-400 mt-2">
            Complete 2 Lessons
          </p>
        </div>

        <div>
          <p className="font-semibold">
            Certificate Progress
          </p>

          <p className="text-blue-400 mt-2">
            65% Remaining
          </p>
        </div>

      </div>

    </section>
  );
}
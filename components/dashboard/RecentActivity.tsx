const activities = [
  "Payment Successful",
  "Enrolled in Cryogenic Engineering",
  "Lesson 2 Completed",
];

export default function RecentActivity() {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-4">

        {activities.map((activity) => (
          <div
            key={activity}
            className="flex items-center gap-3 text-gray-300"
          >
            <span className="text-emerald-400">✔</span>

            {activity}
          </div>
        ))}

      </div>

    </section>
  );
}
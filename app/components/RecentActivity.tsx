"use client";

export default function RecentActivity() {
  const activities = [
    {
      icon: "🎉",
      title: "Welcome to DevMechLab",
      time: "Account created",
    },
    {
      icon: "✅",
      title: "Profile completed successfully",
      time: "Ready to start learning",
    },
    {
      icon: "📚",
      title: "Explore your first course",
      time: "Start your learning journey",
    },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">

      <h2 className="text-2xl font-bold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-6">

        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-4 border-b border-slate-800 pb-5 last:border-0 last:pb-0"
          >
            <div className="text-3xl">
              {activity.icon}
            </div>

            <div>
              <h3 className="font-semibold text-lg">
                {activity.title}
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}

      </div>

    </div>
  );
}
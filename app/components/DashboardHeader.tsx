"use client";

type DashboardHeaderProps = {
  fullName: string;
};

export default function DashboardHeader({
  fullName,
}: DashboardHeaderProps) {
  const hour = new Date().getHours();

  let greeting = "Good Evening";

  if (hour < 12) {
    greeting = "Good Morning";
  } else if (hour < 17) {
    greeting = "Good Afternoon";
  }

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">

      <h1 className="text-4xl font-bold">
        👋 {greeting},
      </h1>

      <h2 className="text-3xl font-bold text-blue-400 mt-3">
        {fullName || "Student"}
      </h2>

      <p className="text-gray-300 mt-5 text-lg">
        Welcome back to <span className="font-semibold">DevMechLab</span>.
      </p>

      <p className="text-gray-400">
        Continue building your engineering career today.
      </p>

      <div className="mt-6 inline-flex items-center rounded-full bg-green-600/20 px-4 py-2">
        <span className="text-green-400 font-semibold">
          🟢 Verified Student
        </span>
      </div>

    </div>
  );
}
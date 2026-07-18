"use client";

export default function CompletionBar({
  percentage,
}: {
  percentage: number;
}) {
  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <div className="flex justify-between mb-3">

        <h2 className="font-bold text-xl">
          Profile Completion
        </h2>

        <span className="font-bold text-blue-400">
          {percentage}%
        </span>

      </div>

      <div className="w-full bg-slate-800 rounded-full h-4">

        <div
          className="bg-blue-600 h-4 rounded-full transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}
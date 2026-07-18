"use client";

export default function DashboardHeader({
  email,
}: {
  email: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <div>
        <h1 className="text-5xl font-bold">
          Welcome 👋
        </h1>

        <p className="text-gray-400 mt-3">
          {email}
        </p>
      </div>

    </div>
  );
}
interface DashboardHeaderProps {
  fullName?: string;
}

export default function DashboardHeader({
  fullName,
}: DashboardHeaderProps) {
  return (
    <section className="mb-10">

      <p className="text-blue-400 font-medium">
        Welcome Back 👋
      </p>

      <h1 className="text-5xl font-bold mt-2">
        {fullName || "Student"}
      </h1>

      <p className="text-gray-400 mt-3 text-lg">
        Continue your engineering journey with DevMechLab.
      </p>

    </section>
  );
}
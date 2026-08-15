const stats = [
  {
    title: "Courses",
    value: "1",
    color: "text-blue-400",
  },
  {
    title: "Internships",
    value: "0",
    color: "text-orange-400",
  },
  {
    title: "Certificates",
    value: "0",
    color: "text-emerald-400",
  },
  {
    title: "Payments",
    value: "₹1999",
    color: "text-pink-400",
  },
];

export default function StatsCards() {
  return (
    <section className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500 transition"
        >
          <p className="text-gray-400">
            {item.title}
          </p>

          <h2 className={`text-4xl font-bold mt-3 ${item.color}`}>
            {item.value}
          </h2>
        </div>
      ))}

    </section>
  );
}
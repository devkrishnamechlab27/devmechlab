"use client";

export default function StatsCards() {
  const cards = [
    {
      title: "Courses",
      value: 0,
      color: "text-blue-400",
    },
    {
      title: "Internships",
      value: 0,
      color: "text-green-400",
    },
    {
      title: "Certificates",
      value: 0,
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">

      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <p className="text-gray-400">
            {card.title}
          </p>

          <h2 className={`text-4xl font-bold mt-2 ${card.color}`}>
            {card.value}
          </h2>
        </div>
      ))}

    </div>
  );
}
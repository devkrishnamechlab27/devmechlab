"use client";

import Link from "next/link";
import { useState } from "react";
import { internships } from "../data/internships";
import { ArrowRight } from "lucide-react";

const categories = [
  "All",
  "Mechanical",
  "Manufacturing",
  "Programming",
  "Cryogenics",
];

export default function InternshipPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredInternships = internships.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-20">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold">
          Training <span className="text-blue-500">Internships</span>
        </h1>

        <p className="mt-5 text-gray-400 text-lg">
          Industry-oriented training internships with real projects,
          mentor support, certificate and letter of recommendation.
        </p>

        <input
          type="text"
          placeholder="🔍 Search Internship..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mt-10 bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 outline-none focus:border-blue-500"
        />

        <div className="flex flex-wrap gap-3 mt-8">

          {categories.map((category) => (

            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2 rounded-full transition ${
                selectedCategory === category
                  ? "bg-blue-600"
                  : "bg-slate-800 hover:bg-slate-700"
              }`}
            >
              {category}
            </button>

          ))}

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

          {filteredInternships.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.slug}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition"
              >

                <Icon size={45} className="text-blue-400" />

                <h2 className="text-2xl font-bold mt-5">
                  {item.title}
                </h2>

                <p className="text-gray-400 mt-3">
                  {item.description}
                </p>

                <div className="flex justify-between mt-6">

                  <span>{item.duration}</span>

                  <span className="text-orange-400 font-bold">
                    {item.fee}
                  </span>

                </div>

                <div className="mt-4">
                  ⭐ {item.rating}
                </div>

                <Link
                  href={`/internships/${item.slug}`}
                  className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl flex justify-center items-center gap-2"
                >
                  View Details
                  <ArrowRight size={18} />
                </Link>

              </div>

            );

          })}

        </div>

      </div>

    </main>
  );
}
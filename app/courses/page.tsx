"use client";
import Link from "next/link";

import { useState } from "react";
import { courses } from "../data/courses";
import { ArrowRight } from "lucide-react";
const categories = [
  "All",
  ...new Set(courses.map((course) => course.category)),
];

export default function CoursesPage() {
 const [search, setSearch] = useState("");
 const [selectedCategory, setSelectedCategory] = useState("All");
 const filteredCourses = courses.filter((course) => {
  const matchesSearch = course.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    course.category === selectedCategory;

  return matchesSearch && matchesCategory;
});
  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-20">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold">
          Engineering <span className="text-blue-500">Courses</span>
        </h1>

        <p className="mt-5 text-gray-400 text-lg">
          Learn industry-ready engineering skills from experienced mentors.
        </p>

        <input
          type="text"
         placeholder="🔍 Search Courses..."
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
          ? "bg-blue-600 text-white"
          : "bg-slate-800 text-gray-300 hover:bg-slate-700"
      }`}
    >
      {category}
    </button>

  ))}

</div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">

          {filteredCourses.map((course, index) => {
            const Icon = course.icon;

            return (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 hover:border-blue-500 transition-all hover:-translate-y-2"
              >

                <Icon className="text-blue-400" size={45} />

                <h2 className="text-2xl font-bold mt-5">
                  {course.title}
                </h2>

                <div className="flex justify-between mt-4 text-gray-400 text-sm">
                  <span>{course.level}</span>
                  <span>{course.duration}</span>
                </div>

                <div className="flex justify-between mt-4">

                  <span>⭐ {course.rating}</span>

                  <span className="text-orange-400 font-bold">
                    {course.price}
                  </span>

                </div>

         <Link
             href={`/courses/${course.slug}`}
             className="mt-8 w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl flex justify-center items-center gap-2 transition"
        >
                  View Details

             <ArrowRight size={18} />
             </Link>

              </div>
            );
          })}

        </div>
        {filteredCourses.length === 0 && (
         <div className="text-center mt-16">
      <h2 className="text-3xl font-bold text-gray-300">
          🔍 No courses found
      </h2>

        <p className="mt-3 text-gray-500">
          Try searching with another keyword.
        </p>
     </div>
)}

      </div>
    </main>
  );
}
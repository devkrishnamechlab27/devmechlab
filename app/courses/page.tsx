"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  instructor: string;
  image: string;
  price: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      const { data, error } = await supabase
  .from("courses")
  .select("*")
  .order("id");

console.log("Courses:", data);
console.log("Error:", error);

      if (!error && data) {
        setCourses(data);
      }

      setLoading(false);
    }

    loadCourses();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Loading Courses...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          Explore Courses
        </h1>

        <p className="text-gray-400 mb-10">
          Learn industry-ready skills with DevMechLab.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden"
            >
              <Image
                src={course.image}
                alt={course.title}
                width={600}
                height={340}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">
                  {course.title}
                </h2>

                <p className="text-gray-400 mt-2">
                  {course.level}
                </p>

                <p className="text-gray-500">
                  {course.duration}
                </p>

                <p className="mt-2 font-semibold text-green-400">
                  {course.price}
                </p>

                <Link
                  href={`/courses/${course.slug}`}
                  className="block mt-6 bg-blue-600 hover:bg-blue-700 text-center py-3 rounded-xl font-semibold"
                >
                  View Course
                </Link>

              </div>
            </div>
          ))}

        </div>
      </div>
    </main>
  );
}
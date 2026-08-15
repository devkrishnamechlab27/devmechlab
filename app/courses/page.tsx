"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import CourseCard from "@/components/CourseCard";

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
  <CourseCard
    key={course.id}
    course={course}
  />
))}

        </div>
      </div>
    </main>
  );
}
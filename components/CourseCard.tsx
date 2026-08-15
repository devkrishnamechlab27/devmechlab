"use client";

import Link from "next/link";
import Image from "next/image";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    slug: string;
    image: string;
    level: string;
    duration: string;
    price: string;
  };
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500 transition">

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

        <p className="mt-4 font-bold text-green-400">
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
  );
}
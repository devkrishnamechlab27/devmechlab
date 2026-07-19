"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

type Internship = {
  id: number;
  title: string;
  slug: string;
  description: string;
  level: string;
  duration: string;
  mentor: string;
  image: string;
  price: string;
  rating: number;
  students: number;
};

export default function InternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInternships() {
      const { data, error } = await supabase
        .from("internships")
        .select("*")
        .order("id");
        console.log("Internships:", data);
        console.log("Error:", error);

      if (!error && data) {
        setInternships(data);
      }

      setLoading(false);
    }

    loadInternships();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-2xl">
        Loading Internships...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-4">
          Explore Internships
        </h1>

        <p className="text-gray-400 mb-10">
          Gain practical industry experience with DevMechLab internships.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {internships.map((internship) => (

            <div
              key={internship.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-blue-500 transition"
            >

              <Image
                src={internship.image}
                alt={internship.title}
                width={600}
                height={340}
                className="w-full h-48 object-cover"
              />

              <div className="p-6">

                <h2 className="text-2xl font-bold">
                  {internship.title}
                </h2>

                <p className="text-gray-400 mt-2">
                  {internship.level}
                </p>

                <p className="text-gray-500">
                  {internship.duration}
                </p>

                <div className="flex justify-between mt-4">

                  <span className="text-yellow-400">
                    ⭐ {internship.rating}
                  </span>

                  <span className="text-gray-400">
                    👨‍🎓 {internship.students}
                  </span>

                </div>

                <p className="mt-4 text-green-400 font-bold text-xl">
                  {internship.price}
                </p>

                <Link
                  href={`/internships/${internship.slug}`}
                  className="block mt-6 bg-blue-600 hover:bg-blue-700 text-center py-3 rounded-xl font-semibold"
                >
                  View Internship
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  );
}
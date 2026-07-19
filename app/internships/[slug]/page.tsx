import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function InternshipDetails({ params }: PageProps) {
  const { slug } = await params;
  

  const { data: internship, error } = await supabase
  .from("internships")
  .select("*")
  .eq("slug", slug)
  .single();

  const whatYouWillLearn =
  (internship.what_you_will_learn as string[]) || [];

const liveProjects =
  (internship.live_projects as string[]) || [];

const includes =
  (internship.includes as string[]) || [];

if (error || !internship) {
  return notFound();
}

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
       <Image
  src={internship.banner}
  alt={internship.title}
  width={1920}
  height={1080}
  priority
  className="w-full h-[320px] object-cover rounded-3xl border border-slate-800 shadow-2xl mb-10"

/>

        <span className="bg-blue-600 px-4 py-2 rounded-full text-sm">
 {internship.category}
</span>

        <h1 className="text-5xl font-bold mt-4">
          {internship.title}
        </h1>

        <p className="mt-6 text-xl text-gray-400">
          {internship.description}
        </p>

        <div className="flex flex-wrap gap-4 mt-8">

  <span className="bg-blue-600 px-4 py-2 rounded-full">
    {internship.level}
  </span>

  <span className="bg-orange-500 px-4 py-2 rounded-full">
    {internship.duration}
  </span>

  <span className="bg-green-600 px-4 py-2 rounded-full">
    ⭐ {internship.rating}
  </span>

 

</div>
        

        {/* What You'll Learn */}

<div className="mt-20">

  <h2 className="text-3xl font-bold mb-8">
    📚 What You'll Learn
  </h2>

  <div className="grid md:grid-cols-2 gap-5">

    {whatYouWillLearn.map((item: string, index: number) => (

      <div
        key={index}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-blue-500 transition"
      >
        <span className="text-green-400 text-xl">✔</span>

        <span className="ml-3">{item}</span>
      </div>

    ))}

  </div>

</div>

    {/* Live Projects */}

<div className="mt-20">

  <h2 className="text-3xl font-bold mb-8">
    🛠 Live Projects
  </h2>

  <div className="grid md:grid-cols-2 gap-5">

    {liveProjects.map((item: string, index: number) => (

      <div
        key={index}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-orange-500 transition"
      >
        📂 {item}
      </div>

    ))}

  </div>

</div>
          
          {/* Internship Includes */}

<div className="mt-20">

  <h2 className="text-3xl font-bold mb-8">
    🎁 Internship Includes
  </h2>

  <div className="grid md:grid-cols-2 gap-5">

    {includes.map((item: string, index: number) => (

      <div
        key={index}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-green-500 transition"
      >
        ✅ {item}
      </div>

    ))}

  </div>

</div>
       {/* Internship Statistics */}

<div className="mt-20">

  <h2 className="text-3xl font-bold mb-8">
    📊 Internship Statistics
  </h2>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

    <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-800">
      <h3 className="text-5xl font-bold text-blue-500">
        {internship.students}
      </h3>

      <p className="mt-3 text-gray-400">
        Students
      </p>
    </div>

    <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-800">
      <h3 className="text-5xl font-bold text-orange-500">
        {internship.rating}
      </h3>

      <p className="mt-3 text-gray-400">
        Rating
      </p>
    </div>

    <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-800">
      <h3 className="text-5xl font-bold text-green-500">
        {internship.duration}
      </h3>

      <p className="mt-3 text-gray-400">
        Duration
      </p>
    </div>

    <div className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-800">
  <h3 className="text-5xl font-bold text-purple-500">
    {liveProjects.length}+
  </h3>

      <p className="mt-3 text-gray-400">
        Live Projects
      </p>
    </div>

  </div>

</div>

    
      </div>

<div className="lg:sticky lg:top-24 h-fit">

  <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl">

    <h2 className="text-5xl font-bold text-orange-400">
      {internship.price}
    </h2>

    <div className="space-y-5 mt-8 text-lg">

      <p>⭐ {internship.rating} Rating</p>

      <p>📚 {internship.duration}</p>

      <p>👨‍🏫 {internship.mentor}</p>

      <p>🌐 {internship.language}</p>

      <p>📜 Internship Certificate Included</p>

      <p>📝 Letter of Recommendation Included</p>

      <p>♾ Lifetime Access</p>

      <p>🎯 Live Mentor Support</p>

    </div>

   <Link
  href={`/internships/checkout/${internship.slug}`}
  className="block w-full mt-10 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl text-xl font-bold text-center transition"
>
  Enroll Now
</Link>

  </div>

</div>
</div>
    </main>
  );
}
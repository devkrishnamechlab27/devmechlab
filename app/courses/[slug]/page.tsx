import { courses } from "../../data/courses";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetails({ params }: PageProps) {
  const { slug } = await params;

  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-20">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">

        
        <p className="text-blue-500 font-semibold">
          {course.category}
        </p>

        <h1 className="text-5xl font-bold mt-4">
          {course.title}
        </h1>

        <p className="mt-6 text-xl text-gray-400">
          {course.description}
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <span className="bg-blue-600 px-4 py-2 rounded-full">
            {course.level}
          </span>

          <span className="bg-orange-500 px-4 py-2 rounded-full">
            {course.duration}
          </span>

          <span className="bg-green-600 px-4 py-2 rounded-full">
            ⭐ {course.rating}
          </span>

          <span className="bg-slate-800 px-4 py-2 rounded-full">
            {course.price}
          </span>
        </div>

        
        {/* Course Information */}

<div className="mt-16 grid md:grid-cols-2 gap-6">

  <div className="bg-slate-900 p-6 rounded-xl">
    <h3 className="text-xl font-bold mb-3">👨‍🏫 Instructor</h3>
    <p>{course.instructor}</p>
  </div>

  <div className="bg-slate-900 p-6 rounded-xl">
    <h3 className="text-xl font-bold mb-3">🎥 Lessons</h3>
    <h3>{course.lessons}+</h3>
  </div>

  <div className="bg-slate-900 p-6 rounded-xl">
    <h3 className="text-xl font-bold mb-3">👥 Students</h3>
    <h3>{course.students}+</h3>
  </div>

  <div className="bg-slate-900 p-6 rounded-xl">
    <h3 className="text-xl font-bold mb-3">🌐 Language</h3>
    <p>{course.language}</p>
  </div>

</div>
  <div className="mt-16">

  <h2 className="text-3xl font-bold mb-6">
    📚 What You'll Learn
  </h2>

  <div className="grid md:grid-cols-2 gap-4">

    {course.whatYouWillLearn?.map((item, index) => (

      <div
        key={index}
        className="bg-slate-900 rounded-xl p-4"
      >
        ✅ {item}
      </div>

    ))}

  </div>

</div>
        <div className="mt-16">

  <h2 className="text-3xl font-bold mb-6">
    📋 Requirements
  </h2>

  <div className="space-y-3">

    {course.requirements?.map((item, index) => (

      <div
        key={index}
        className="bg-slate-900 rounded-xl p-4"
      >
        • {item}
      </div>

    ))}

  </div>

</div>
<div className="mt-16">

  <h2 className="text-3xl font-bold mb-6">
    📊 Course Statistics
  </h2>

  <div className="grid md:grid-cols-4 gap-6">

    <div className="bg-slate-900 rounded-xl p-6 text-center">
      <h3 className="text-4xl font-bold text-blue-500">
        {course.lessons}
      </h3>
      <p className="mt-2 text-gray-400">
        Lessons
      </p>
    </div>

    <div className="bg-slate-900 rounded-xl p-6 text-center">
      <h3 className="text-4xl font-bold text-orange-500">
        {course.students}
      </h3>
      <p className="mt-2 text-gray-400">
        Students
      </p>
    </div>

    <div className="bg-slate-900 rounded-xl p-6 text-center">
      <h3 className="text-4xl font-bold text-green-500">
        {course.rating}
      </h3>
      <p className="mt-2 text-gray-400">
        Rating
      </p>
    </div>

    <div className="bg-slate-900 rounded-xl p-6 text-center">
      <h3 className="text-4xl font-bold text-yellow-500">
        {course.duration}
      </h3>
      <p className="mt-2 text-gray-400">
        Duration
      </p>
    </div>

  </div>

</div>
</div><div className="lg:sticky lg:top-24 h-fit">

  <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-xl">

    <h2 className="text-4xl font-bold text-orange-400">
      {course.price}
    </h2>

    <div className="mt-6 space-y-4 text-gray-300">

      <p>⭐ Rating: {course.rating}</p>

      <p>📚 Level: {course.level}</p>

      <p>⏳ Duration: {course.duration}</p>

      <p>🌐 Language: {course.language}</p>

      <p>
        📜 Certificate:{" "}
        {course.certificate ? "Included" : "No"}
      </p>

    </div>
     <div className="mt-8 border-t border-slate-700 pt-6">

  <h3 className="text-lg font-bold mb-4">
    This Course Includes
  </h3>

  <div className="space-y-3 text-gray-300">

    <p>🎥 42+ HD Video Lessons</p>

    <p>📄 Downloadable Notes</p>

    <p>📝 Practice Assignments</p>

    <p>💻 Real Industry Projects</p>

    <p>📜 QR Verified Certificate</p>

    <p>♾️ Lifetime Access</p>

    <p>📱 Mobile & Desktop Access</p>

  </div>

</div>
    <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold text-lg transition">
      Enroll Now
    </button>

  </div>

</div>
      </div>
    </main>
  );
}
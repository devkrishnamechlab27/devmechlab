interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetails({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-20">
      <div className="max-w-5xl mx-auto">
        <p className="text-blue-500 font-semibold">
          Course Details
        </p>

        <h1 className="text-5xl font-bold mt-4">
          {slug.replaceAll("-", " ")}
        </h1>

        <div className="flex gap-4 mt-6">
          <span className="bg-blue-600 px-4 py-2 rounded-full">
            Beginner
          </span>

          <span className="bg-orange-500 px-4 py-2 rounded-full">
            6 Weeks
          </span>

          <span className="bg-green-600 px-4 py-2 rounded-full">
            ⭐ 4.9
          </span>
        </div>

        <p className="mt-10 text-gray-400 text-lg leading-8">
          This page will display complete information about the selected
          course, including syllabus, instructor, projects, certificate,
          FAQs, and enrollment details.
        </p>

        <button className="mt-10 bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl font-semibold">
          Enroll Now
        </button>
      </div>
    </main>
  );
}
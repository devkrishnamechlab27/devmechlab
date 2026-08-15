import CoursePlayer from "@/components/learn/CoursePlayer";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LearnPage({ params }: Props) {
  const { slug } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

 console.log("USER:", user);

if (!user) {
  return <div className="text-white p-10">User Not Found</div>;
}

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  console.log("COURSE:", course);

if (!course) {
  return <div className="text-white p-10">Course Not Found</div>;
}

  const { data: lessons, error: lessonsError } = await supabase
  .from("lessons")
  .select("*")
  .eq("course_id", course.id)
  .order("lesson_number");

console.log("COURSE ID:", course.id);
console.log("LESSONS:", lessons);
console.log("LESSONS ERROR:", lessonsError);

  return (
  <CoursePlayer
    course={{
      id: course.id,
      title: course.title,
    }}
    lessons={lessons ?? []}
    userId={user.id}
  />
);
}
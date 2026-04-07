import { notFound } from "next/navigation";
import prisma from "@/_dbConfig/dbConfig";
import CourseDetailClient from "./_Components/CourseDetailClient";

interface CreateCoursePageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CreateCoursePage({ params }: CreateCoursePageProps) {
  const { courseId } = await params;

  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) notFound();

  return (
    <div className="p-8">
      <CourseDetailClient course={course} />
    </div>
  );
}
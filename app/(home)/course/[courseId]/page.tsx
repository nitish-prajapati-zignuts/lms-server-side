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
    include: {
      modules: {
        where: { isDeleted: false },
        orderBy: { order: "asc" }
      }
    }
  });

  if (!course) notFound();

  return (
    <div className="p-2">
      <CourseDetailClient 
        course={course} 
        initialModules={course.modules}
      />
    </div>
  );
}
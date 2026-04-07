"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  ImageIcon,
  CalendarDays,
  AlignLeft,
  Pencil,
  BookOpen,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Course = {
  id: string;
  title: string | null;
  description: string | null;
  image: string | null;
  duration: number | null;
  createdAt: Date;
  updatedAt: Date;
};

interface CourseDetailClientProps {
  course: Course;
}

// ── Duration formatter ────────────────────────────────────────────────────────
function formatDuration(hours: number): { value: string; unit: string } {
  if (hours < 24) {
    return { value: hours % 1 === 0 ? String(hours) : hours.toFixed(1), unit: hours === 1 ? "hour" : "hours" };
  }
  const days = hours / 24;
  if (days <= 7) {
    const rounded = Math.round(days * 10) / 10;
    return { value: rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1), unit: rounded === 1 ? "day" : "days" };
  }
  const weeks = days / 7;
  const rounded = Math.round(weeks * 10) / 10;
  return { value: rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1), unit: rounded === 1 ? "week" : "weeks" };
}
// ─────────────────────────────────────────────────────────────────────────────

export default function CourseDetailClient({ course }: CourseDetailClientProps) {
  const router = useRouter();
  const duration = course.duration != null ? formatDuration(course.duration) : null;

  return (
    <div className="min-h-screen bg-stone-50 p-6 md:p-10">
      {/* ── Back ──────────────────────────────────────────────────────────── */}
      <button
        onClick={() => router.back()}
        className="group inline-flex items-center gap-2 text-stone-400 hover:text-stone-700 transition-colors duration-200 mb-8 text-sm font-medium"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        Back to courses
      </button>

      {/* ── Hero card ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden">

        {/* Top section — image left, details right */}
        <div className="flex flex-col lg:flex-row">

          {/* ── Left: Cover image ───────────────────────────────────────── */}
          <div className="lg:w-96 lg:shrink-0">
            {course.image ? (
              <img
                src={course.image}
                alt={course.title ?? "Course cover"}
                className="w-full h-64 lg:h-full object-cover"
              />
            ) : (
              <div className="w-full h-64 lg:h-full bg-gradient-to-br from-amber-50 via-stone-100 to-stone-200 flex flex-col items-center justify-center gap-3">
                <div className="h-16 w-16 rounded-2xl bg-white/70 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  <ImageIcon className="h-8 w-8 text-amber-400" />
                </div>
                <p className="text-xs text-stone-400 font-medium">No cover image</p>
              </div>
            )}
          </div>

          {/* ── Right: Details ──────────────────────────────────────────── */}
          <div className="flex-1 p-8 lg:p-10 flex flex-col justify-between">

            {/* Title + ID */}
            <div>
              {/* Category pill */}
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100 rounded-full px-3 py-1 mb-4">
                <BookOpen className="h-3 w-3" />
                Course
              </span>

              <h1 className="text-3xl font-extrabold text-stone-800 leading-tight mb-2">
                {course.title ?? (
                  <span className="italic text-stone-400">Untitled Course</span>
                )}
              </h1>

              <div className="flex items-center gap-1.5 mb-6">
                <Hash className="h-3 w-3 text-stone-300" />
                <span className="font-mono text-xs text-stone-400 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-md">
                  {course.id}
                </span>
              </div>

              {/* Stat chips */}
              <div className="flex flex-wrap gap-3 mb-8">
                {/* Duration chip */}
                <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Duration</p>
                    {duration ? (
                      <p className="text-sm font-bold text-stone-700">
                        {duration.value}{" "}
                        <span className="font-medium text-stone-500">{duration.unit}</span>
                      </p>
                    ) : (
                      <p className="text-sm italic text-stone-400">Not specified</p>
                    )}
                  </div>
                </div>

                {/* Created chip */}
                <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center">
                    <CalendarDays className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Created</p>
                    <p className="text-sm font-bold text-stone-700">
                      {new Date(course.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Last updated chip */}
                <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Pencil className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Updated</p>
                    <p className="text-sm font-bold text-stone-700">
                      {new Date(course.updatedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3">
              <Button
                className="bg-stone-800 hover:bg-stone-700 text-white rounded-2xl px-6 h-11 font-semibold shadow-sm transition-all duration-200 hover:shadow-md"
                onClick={() => router.push(`/create-course/${course.id}/edit`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Course
              </Button>
              <Button
                variant="outline"
                className="rounded-2xl px-6 h-11 font-semibold border-stone-200 text-stone-600 hover:bg-stone-50 transition-all duration-200"
                onClick={() => router.back()}
              >
                Back
              </Button>
            </div>
          </div>
        </div>

        {/* ── Description section ───────────────────────────────────────────── */}
        <div className="border-t border-stone-100 px-8 lg:px-10 py-8">
          <div className="flex items-center gap-2 mb-3">
            <AlignLeft className="h-4 w-4 text-amber-500" />
            <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-widest">
              Description
            </h2>
          </div>
          <p className="text-stone-600 text-sm leading-relaxed max-w-3xl">
            {course.description ?? (
              <span className="italic text-stone-400">No description provided yet. Edit this course to add one.</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

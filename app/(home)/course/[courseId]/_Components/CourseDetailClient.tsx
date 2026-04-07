"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Pencil,
  Plus,
  Trash2,
  ChevronRight,
  BookOpen,
  AlignLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@tinymce/tinymce-react').then(mod => mod.Editor), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-stone-50 animate-pulse flex items-center justify-center text-stone-400">Loading Editor...</div>
});

import { createModule, updateModule, deleteModule } from "../_ServerActions/action";

type Module = {
  id: string;
  courseId: string;
  title: string | null;
  content: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

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
  initialModules: Module[];
}

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

export default function CourseDetailClient({ course, initialModules }: CourseDetailClientProps) {
  const router = useRouter();
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(
    modules.length > 0 ? modules[0].id : null
  );
  const [isSaving, setIsSaving] = useState(false);

  const duration = course.duration != null ? formatDuration(course.duration) : null;
  const activeModule = modules.find((m) => m.id === activeModuleId);

  const handleAddModule = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("courseId", course.id);
    const result = await createModule(course.id, undefined, formData);
    if (result && result.success && result.data) {
      const newModule = result.data as Module;
      setModules([...modules, newModule]);
      setActiveModuleId(newModule.id);
    }
    setIsSaving(false);
  };

  const handleDeleteModule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;
    const formData = new FormData();
    formData.append("moduleId", id);
    const result = await deleteModule(id, undefined, formData);
    if (result && result.success) {
      const updatedModules = modules.filter((m) => m.id !== id);
      setModules(updatedModules);
      if (activeModuleId === id) {
        setActiveModuleId(updatedModules.length > 0 ? updatedModules[0].id : null);
      }
    }
  };

  const extractTitleFromContent = (content: string) => {
    if (typeof window === 'undefined') return "Untitled Module";
    const doc = new DOMParser().parseFromString(content, 'text/html');
    const text = doc.body.textContent || "";
    const firstLine = text.split('\n')[0].trim();
    return firstLine.substring(0, 50) || "Untitled Module";
  };

  const handleEditorChange = (content: string) => {
    if (!activeModuleId) return;

    const newTitle = extractTitleFromContent(content);

    // Local update only (for UI responsiveness)
    setModules(prev => prev.map(m =>
      m.id === activeModuleId ? { ...m, content, title: newTitle } : m
    ));
  };

  const handleSubmit = async () => {
    if (!activeModuleId || !activeModule) return;

    setIsSaving(true);
    const formData = new FormData();
    formData.append("moduleId", activeModuleId);
    formData.append("content", activeModule.content || "");
    formData.append("title", activeModule.title || "");

    const result = await updateModule(activeModuleId, undefined, formData);
    setIsSaving(false);
  };

  return (
    <div className="p-4 space-y-6">
      {/* Course Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold text-stone-800 leading-tight">
              {course.title ?? <span className="italic text-stone-400">Untitled Course</span>}
            </h1>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-100 rounded-2xl px-4 py-2.5">
                <div className="h-8 w-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Duration</p>
                  {duration ? (
                    <p className="text-sm font-bold text-stone-700">
                      {duration.value} <span className="font-medium text-stone-500">{duration.unit}</span>
                    </p>
                  ) : (
                    <p className="text-sm italic text-stone-400">Not specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Management Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
        {/* Module Sidebar (1/3) */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-6 border-b border-stone-50 flex justify-between items-center bg-stone-50/30">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-stone-600" />
                <h2 className="text-lg font-bold text-stone-800">Modules</h2>
              </div>
              <Button
                onClick={handleAddModule}
                disabled={isSaving}
                className="h-10 w-10 rounded-xl bg-stone-800 hover:bg-stone-700 flex items-center justify-center p-0"
              >
                <Plus className="h-5 w-5 text-white" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {modules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-stone-400 italic">
                  <p>No modules yet</p>
                  <p className="text-xs">Click + to add your first module</p>
                </div>
              ) : (
                modules.map((module, index) => (
                  <div
                    key={module.id}
                    onClick={() => setActiveModuleId(module.id)}
                    className={`
                      group relative flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-200
                      ${activeModuleId === module.id
                        ? 'bg-stone-100 border-stone-200 border shadow-inner ring-1 ring-stone-900/5'
                        : 'bg-white hover:bg-stone-50 border border-transparent'}
                    `}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`
                        shrink-0 h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold
                         ${activeModuleId === module.id ? 'bg-stone-800 text-white' : 'bg-stone-50 text-stone-400'}
                      `}>
                        {index + 1}
                      </div>
                      <span className={`text-sm font-semibold truncate ${activeModuleId === module.id ? 'text-stone-900' : 'text-stone-600'}`}>
                        {module.title || "Untitled Module"}
                      </span>
                    </div>

                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }}
                        className="h-8 w-8 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <ChevronRight className={`h-4 w-4 ml-1 ${activeModuleId === module.id ? 'text-stone-800' : 'text-stone-300'}`} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Editor Area (2/3) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden flex flex-col">
          {activeModuleId && activeModule ? (
            <div className="flex-1 flex flex-col h-full">
              <div className="p-4 border-b border-stone-50 bg-stone-50/30 flex justify-between items-center">
                <input
                  type="text"
                  value={activeModule.title || ""}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setModules(prev => prev.map(m => m.id === activeModuleId ? { ...m, title: newTitle } : m));
                  }}
                  className="bg-transparent border-none focus:ring-0 text-xl font-bold text-stone-800 w-full placeholder:text-stone-300"
                  placeholder="Module Title"
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="bg-stone-800 hover:bg-stone-700 text-white rounded-xl px-6 h-10 font-bold shadow-sm transition-all shrink-0"
                >
                  {isSaving ? "Saving..." : "Submit Changes"}
                </Button>
              </div>
              <div className="flex-1 min-h-[500px]">
                <Editor
                  apiKey='nqx7j4zx9j4hx7btircloml2xakektii4t8r21rj7d4v0w1q' // You might want to get a real API key or use local
                  value={activeModule.content || ""}
                  onEditorChange={handleEditorChange}
                  init={{
                    height: "100%",
                    menubar: false,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: `
                      body { 
                        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
                        font-size: 16px; 
                        line-height: 1.6;
                        color: #444;
                        padding: 20px;
                      }
                      h1, h2, h3 { color: #1c1917; }
                    `,
                    border: 0,
                    statusbar: true,
                    promotion: false,
                    branding: false,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-stone-400 space-y-4">
              <div className="h-16 w-16 bg-stone-50 rounded-2xl flex items-center justify-center">
                <AlignLeft className="h-8 w-8 text-stone-200" />
              </div>
              <div>
                <p className="font-semibold text-stone-500">Select a module to edit</p>
                <p className="text-sm">Content and title will appear here</p>
              </div>
              {modules.length === 0 && (
                <Button onClick={handleAddModule} variant="outline" className="rounded-xl border-stone-200 mt-4">
                  Create your first module
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

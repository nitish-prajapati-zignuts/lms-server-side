"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCourse } from "../../course/_ServerActions/action";
import { updateCourse } from "../../course/[courseId]/_ServerActions/action";

interface CreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateCourseModal({ isOpen, onClose }: CreateCourseModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // courseId is pre-generated as soon as the modal opens
  const [courseId, setCourseId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Track whether we've already initialized for the current open session
  const initializedRef = useRef(false);

  // ── Step 1: Create empty course when modal opens ─────────────────────────
  useEffect(() => {
    if (isOpen && !initializedRef.current) {
      initializedRef.current = true;
      setIsInitializing(true);
      setErrorMessage(null);

      startTransition(async () => {
        const result = await createCourse(undefined, undefined);
        setIsInitializing(false);

        if (result?.success && result?.courseId) {
          setCourseId(result.courseId);
        } else {
          setErrorMessage(result?.message || "Failed to initialize course. Please try again.");
        }
      });
    }

    // Reset state when modal closes
    if (!isOpen) {
      setCourseId(null);
      setErrorMessage(null);
      initializedRef.current = false;
    }
  }, [isOpen]);

  // ── Step 2: On submit, update the pre-created course with form values ────
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseId) return;

    const formData = new FormData(e.currentTarget);
    setErrorMessage(null);

    startTransition(async () => {
      const result = await updateCourse(courseId, null, formData);

      if (result?.success) {
        onClose();
        router.push(`/course/${courseId}`);
      } else {
        setErrorMessage(result?.message || "Something went wrong.");
      }
    });
  };

  const isLoading = isPending || isInitializing;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new course</DialogTitle>
            <DialogDescription>
              Provide the initial details for your new course to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Course Title*</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Advanced TypeScript Development"
                disabled={isLoading}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Short Description</Label>
              <Input
                id="description"
                name="description"
                placeholder="What is this course about?"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (hours)</Label>
              <Input
                id="duration"
                name="duration"
                type="number"
                placeholder="e.g. 12.5"
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/image.jpg"
                disabled={isLoading}
              />
            </div>
          </div>

          {errorMessage && (
            <div className="text-sm font-medium text-red-500 mb-2">
              {errorMessage}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !courseId}>
              {isInitializing
                ? "Preparing..."
                : isPending
                  ? "Creating..."
                  : "Continue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

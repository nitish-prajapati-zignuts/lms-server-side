"use client";

import { useState, useTransition } from "react";
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
import { updateCourse } from "./../_ServerActions/action";

interface SetupCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
}

export function SetupCourseModal({ isOpen, onClose, courseId }: SetupCourseModalProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!courseId) return;

    const formData = new FormData(e.currentTarget);
    formData.append("courseId", courseId);
    setErrorMessage(null);

    startTransition(async () => {
      const result = await updateCourse(undefined, formData);

      if (result?.success) {
        onClose();
        router.refresh(); // Refresh to update title layout
      } else {
        setErrorMessage(result?.message || "Something went wrong.");
      }
    });
  };

  const isLoading = isPending;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Setup your course</DialogTitle>
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
              {isPending ? "Saving..." : "Save Details"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

"use server";

import prisma from "@/_dbConfig/dbConfig";
import { withAuth } from "@/Utils/withAuth";
import { ResponseState } from "@/Utils/types";

export const updateCourse = withAuth(async ({ prevState, formData, user }): Promise<ResponseState> => {
    try {
        if (!formData) {
            return { status: 400, success: false, message: "No form data provided" };
        }

        const courseId = formData.get("courseId") as string;
        if (!courseId) {
            return { status: 400, success: false, message: "Course ID is required" };
        }

        const title       = formData.get("title") as string;
        const description = (formData.get("description") as string) || null;
        const durationStr = formData.get("duration") as string;
        const duration    = durationStr ? parseInt(durationStr, 10) : null;
        const image       = (formData.get("image") as string) || null;

        if (!title) {
            return { status: 400, success: false, message: "Title is required" };
        }

        const course = await prisma.course.update({
            where: { id: courseId },
            data: { title, description, duration, image },
        });

        return { 
            status: 200,
            success: true, 
            message: "Course updated successfully!",
            data: { course, courseId }
        };
    } catch (error) {
        console.error(error);
        return { status: 500, success: false, message: "Something went wrong!" };
    }
});

export const getModules = withAuth(async ({ prevState, formData, user }): Promise<ResponseState> => {
    try {
        const courseId = formData?.get("courseId") as string;
        if (!courseId) return { status: 400, success: false, message: "No courseId provided" };

        const modules = await prisma.module.findMany({
            where: {
                courseId,
                isDeleted: false
            },
            orderBy: { order: "asc" }
        });

        return {
            status: 200,
            success: true,
            message: "Modules fetched successfully",
            data: modules
        };
    } catch (error) {
        console.error(error);
        return { status: 500, success: false, message: "Failed to fetch modules" };
    }
});

export const createModule = withAuth(async ({ prevState, formData, user }): Promise<ResponseState> => {
    try {
        const courseId = formData?.get("courseId") as string;
        if (!courseId) {
            return { status: 400, success: false, message: "Course ID is required" };
        }

        const moduleCount = await prisma.module.count({
            where: { courseId, isDeleted: false }
        });

        const newModule = await prisma.module.create({
            data: {
                courseId,
                title: "New Module",
                content: "",
                order: moduleCount
            }
        });

        return {
            status: 201,
            success: true,
            message: "Module created successfully",
            data: newModule
        };
    } catch (error) {
        console.error(error);
        return { status: 500, success: false, message: "Failed to create module" };
    }
});

export const updateModule = withAuth(async ({ prevState, formData, user }): Promise<ResponseState> => {
    try {
        const moduleId = formData?.get("moduleId") as string;
        if (!moduleId) {
            return { status: 400, success: false, message: "Module ID is required" };
        }

        const title = formData?.get("title") as string;
        const content = formData?.get("content") as string;

        const updatedModule = await prisma.module.update({
            where: { id: moduleId },
            data: { title, content }
        });

        return {
            status: 200,
            success: true,
            message: "Module updated successfully",
            data: updatedModule
        };
    } catch (error) {
        console.error(error);
        return { status: 500, success: false, message: "Failed to update module" };
    }
});

export const deleteModule = withAuth(async ({ prevState, formData, user }): Promise<ResponseState> => {
    try {
        const moduleId = formData?.get("moduleId") as string;
        if (!moduleId) {
            return { status: 400, success: false, message: "Module ID is required" };
        }

        const deletedModule = await prisma.module.update({
            where: { id: moduleId },
            data: { isDeleted: true }
        });

        return {
            status: 200,
            success: true,
            message: "Module deleted successfully",
            data: deletedModule
        };
    } catch (error) {
        console.error(error);
        return { status: 500, success: false, message: "Failed to delete module" };
    }
});

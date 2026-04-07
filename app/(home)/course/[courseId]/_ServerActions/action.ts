"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decodeJsonWebToken } from "@/Utils/JsonWebToken";
import prisma from "@/_dbConfig/dbConfig";

export async function updateCourse(
    courseId: string,
    prevState: any,
    formData: FormData
): Promise<any> {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) redirect("/login");

    const user = decodeJsonWebToken({ token });
    if (!user) redirect("/login");

    try {
        if (!formData) {
            return { status: 400, success: false, message: "No form data provided" };
        }

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
            course,
        courseId,
    };
  } catch (error) {
        console.error(error);
        return { status: 500, success: false, message: "Something went wrong!" };
    }
}

export async function getModules(courseId: string): Promise<any> {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) redirect("/login");

    const user = decodeJsonWebToken({ token });
    if (!user) redirect("/login");

    try {
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
}

export async function createModule(
    courseId: string,
    prevState: any,
    formData: FormData
): Promise<any> {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) redirect("/login");

    const user = decodeJsonWebToken({ token });
    if (!user) redirect("/login");

    try {
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
}

export async function updateModule(
    moduleId: string,
    prevState: any,
    formData: FormData
): Promise<any> {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) redirect("/login");

    const user = decodeJsonWebToken({ token });
    if (!user) redirect("/login");

    try {
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;

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
}

export async function deleteModule(
    moduleId: string,
    prevState: any,
    formData: FormData
): Promise<any> {
    const token = (await cookies()).get("auth-token")?.value;
    if (!token) redirect("/login");

    const user = decodeJsonWebToken({ token });
    if (!user) redirect("/login");

    try {
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
}

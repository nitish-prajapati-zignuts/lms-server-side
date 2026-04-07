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

"use server";

import { withAuth } from "@/Utils/withAuth";
import prisma from "@/_dbConfig/dbConfig";

export const createCourse = withAuth(async ({ prevState, formData, user }): Promise<any> => {
    try {

        const course = await prisma.course.create({
            data: {},
        });

        return {
            status: 200,
            success: true,
            message: "Course created successfully",
            courseId: course.id,
        };
    } catch (error) {
        console.error(error);
        return {
            status: 500,
            success: false,
            message: "Something went wrong!",
        };
    }
});

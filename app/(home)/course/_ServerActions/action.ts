"use server";

import { ResponseState } from "@/Utils/types";
import { withAuth } from "@/Utils/withAuth";
import prisma from "@/_dbConfig/dbConfig";

export const createCourse = withAuth(async ({ prevState, formData, user }): Promise<ResponseState> => {
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

export const getAllCourses = withAuth(async ({ prevState, formData, user }): Promise<ResponseState> => {
    try {

        const course = await prisma.course.findMany({
            where: {
                isDeleted: false
            }
        });

        return {
            status: 200,
            success: true,
            message: "Course fetched successfully",
            data: course
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
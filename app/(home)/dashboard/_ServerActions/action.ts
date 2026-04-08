"use server"

import prisma from "@/_dbConfig/dbConfig";
import { errorResponse, ResponseState, successResponse } from "@/Utils/types";
import { withAuth } from "@/Utils/withAuth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type Role = "ADMIN" | "USER";


export type AdminDashboardResponse = {
    role: "ADMIN";
    totalUsers: number;
    totalCourses: number;
    totalActiveUsers: number;
};

export type UserDashboardResponse = {
    role: "USER";
    enrolledCourse: number;
};

export type DashboardResponse =
    | AdminDashboardResponse
    | UserDashboardResponse;

export const adminDashboardHandler = async (): Promise<AdminDashboardResponse> => {
    const totalUsers = await prisma.registration.count({
        where: { role: "USER", isDeleted: false }
    });

    const totalCourses = await prisma.course.count({
        where: { isDeleted: false }
    });

    const activeUsers = await prisma.sessions.findMany({
        where: { isDeleted: false },
        distinct: ["userId"],
        select: { userId: true }
    });

    return {
        role: "ADMIN",
        totalUsers,
        totalCourses,
        totalActiveUsers: activeUsers.length
    };
};

export const userDashboardHandler = async (
    userId: string
): Promise<UserDashboardResponse> => {
    const enrolledCourse = await prisma.enrollment.count({
        where: {
            userId,
            isDeleted: false
        }
    });

    return {
        role: "USER",
        enrolledCourse
    };
};

const dashboardFactory = {
    ADMIN: () => adminDashboardHandler(),
    USER: (userId: string) => userDashboardHandler(userId)
}

export const getDashboardService = async (
    role: Role,
    userId: string
) => {
    const handler = dashboardFactory[role];
    if (!handler) {
        throw new Error("Invalid role");
    }
    return handler(userId);
}


export const getDashboardData = withAuth(async ({ user }): Promise<ResponseState<DashboardResponse>> => {
    try {
        const data = await getDashboardService(user.role as Role, user.id as string);
        return successResponse(data, "Success", 200);
    } catch (error) {
        return errorResponse("Failed to fetch dashboard data", 500);
    }

}, { action: "view", subject: "dashboard" });

export const logout = withAuth((async ({ user }) => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get("auth-token")?.value

        console.log(token)
        if (!token) {
            redirect("/login")
        }

        const session = await prisma.sessions.findFirst({
            where: {
                userId: user.id,
                isDeleted: false,
                token: token
            }
        })

        if (!session) {
            return errorResponse("Session not found", 500);
        }

        await prisma.sessions.update({
            where: {
                id: session.id,
                token: token
            }, data: {
                isDeleted: true
            }
        });

        cookieStore.delete("auth-token");

        //return successResponse({}, "Logout Successfully", 200);
    } catch (error) {
        return errorResponse("Failed to logout", 500);
    }

    redirect("/login")
}))
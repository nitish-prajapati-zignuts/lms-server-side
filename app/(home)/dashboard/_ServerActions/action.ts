import prisma from "@/_dbConfig/dbConfig";
import { withAuth } from "@/Utils/withAuth";

export const getDashboardData = withAuth(async ({ user }) => {

    //if the User ==> Admin
    if (user.role === "ADMIN") {
        const totalUsers = await prisma.registration.count({
            where: {
                role: "USER",
                isDeleted: false
            }
        })


        const totalCourses = await prisma.course.count({
            where: {
                isDeleted: false
            }
        })

        const activeUsers = await prisma.sessions.findMany({
            where: {
                isDeleted: false
            },
            distinct: ['userId'],
            select: {
                userId: true
            }
        });

        return {
            totalUsers,
            totalCourses,
            totalActiveUsers: activeUsers.length
        }
    }

   

    //if the User ==> User
    console.log("User from server action", user)
    return {
        message: "Hello from server action",
        user
    }
})
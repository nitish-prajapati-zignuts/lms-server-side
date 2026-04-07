import { withAuth } from "@/Utils/withAuth";

export const getDashboardData = withAuth(async ({ user }) => {
    console.log("User from server action",user)
    return {
        message: "Hello from server action",
        user
    }
})
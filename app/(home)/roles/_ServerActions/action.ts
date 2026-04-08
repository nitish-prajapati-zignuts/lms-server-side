import prisma from "@/_dbConfig/dbConfig";
import { ResponseState } from "@/Utils/types";
import { withAuth } from "@/Utils/withAuth";

export const addingRoles = withAuth(async ({ user, formData }): Promise<ResponseState> => {
    try {

        const role = formData?.get("role") as string;
        if (!role) {
            return {
                status: 400,
                success: false,
                message: "Role is required"
            }
        }

        await prisma.role.create({
            data: {
                role: role,

            }
        })

        return {
            status: 200,
            success: true,
            message: "Role added successfully"
        }


    } catch (error) {
        return {
            status: 500,
            success: false,
            message: "Failed to add role"
        }
    }
})

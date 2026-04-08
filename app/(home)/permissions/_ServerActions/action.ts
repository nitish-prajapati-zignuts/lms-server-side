"use server"

import prisma from "@/_dbConfig/dbConfig";
import { revalidatePath } from "next/cache";

export async function toggleRolePermission(roleId: string, permissionId: string, enabled: boolean) {
    try {
        if (enabled) {
            await prisma.rolePermission.create({
                data: { roleId, permissionId }
            });
        } else {
            await prisma.rolePermission.delete({
                where: {
                    roleId_permissionId: { roleId, permissionId }
                }
            });
        }
        revalidatePath("/permissions");
        return { success: true };
    } catch (error: any) {
        console.error("Error toggling role permission:", error.message);
        return { success: false, error: `Failed to update permission: ${error.message}` };
    }
}

export async function createNewRole(name: string, description: string) {
    try {
        await prisma.role.create({
            data: { role: name, description }
        });
        revalidatePath("/permissions");
        return { success: true };
    } catch (error: any) {
        console.error("Error creating new role:", error.message);
        return { success: false, error: `Failed to create role: ${error.message}` };
    }
}
import prisma from "@/_dbConfig/dbConfig";

/**
 * Checks if a user has a specific permission based on their assigned roles.
 * @param userId The ID of the user to check.
 * @param action The action being performed (e.g., 'view', 'create', 'update', 'delete', 'manage').
 * @param subject The subject of the action (e.g., 'dashboard', 'users', 'courses', 'permissions').
 * @returns A boolean indicating if the user has the required permission.
 */
export async function hasPermission(userId: string, action: string, subject: string): Promise<boolean> {
    try {
        const permissionCount = await prisma.userRole.count({
            where: {
                userId,
                role: {
                    permissions: {
                        some: {
                            permission: {
                                action,
                                subject
                            }
                        }
                    }
                }
            }
        });

        return permissionCount > 0;
    } catch (error) {
        console.error("Error checking permission:", error);
        return false;
    }
}

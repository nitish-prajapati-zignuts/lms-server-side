import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decodeJsonWebToken, DecodeTokenPayload } from "./JsonWebToken"
import { hasPermission } from "./checkPermission"
import { errorResponse } from "./types"

type Permission = {
    action: string
    subject: string
}

type ActionFn<T = any> = (args: {
    prevState?: any
    formData?: FormData
    user: DecodeTokenPayload
}) => Promise<T>

export const withAuth = (fn: ActionFn, requiredPermission?: Permission) => {
    return async (prevState?: any, formData?: FormData) => {
        try {
            const token = (await cookies()).get("auth-token")?.value
            if (!token) {
                redirect("/login")
            }

            const decodedToken = decodeJsonWebToken({ token })

            if (!decodedToken) {
                redirect("/login")
            }

            // Check database permissions if required
            // if (requiredPermission) {
            //     const userId = (decodedToken as any).id || (decodedToken.data as any)?.id;
            //     if (!userId) {
            //         console.error("No userId found in token for permission check")
            //         return errorResponse("Authentication failed", 500);
            //     }

            //     const permitted = await hasPermission(userId, requiredPermission.action, requiredPermission.subject);
            //     if (!permitted) {
            //         console.error(`Permission denied: User ${userId} tried ${requiredPermission.action}:${requiredPermission.subject}`)
            //         return errorResponse("Permission denied", 500);
            //     }
            // }

            return await fn({
                prevState,
                formData,
                user: decodedToken,
            })
        } catch (error: any) {
            // Re-throw redirect errors so Next.js can handle them
            if (error.message?.includes("NEXT_REDIRECT")) {
                throw error
            }
            console.error("Auth Exception:", error.message)
            redirect("/login")
        }
    }
}
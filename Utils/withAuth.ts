import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decodeJsonWebToken } from "./JsonWebToken"

type ActionFn<T = any> = (args: {
    prevState?: any
    formData?: FormData
    user: any
}) => Promise<T>

export const withAuth = (fn: ActionFn) => {
    return async (prevState?: any, formData?: FormData) => {
        try {
            const token = (await cookies()).get("auth-token")?.value
            console.log("Token from Cookies", token)
            if (!token) {
                redirect("/login")
            }

            const decodedToken = decodeJsonWebToken({ token })

            if (!decodedToken) {
                redirect("/login")
            }

            console.log("Decoded Token", decodedToken)

            return await fn({
                prevState,
                formData,
                user: decodedToken,
            })
        } catch (error) {
            redirect("/login")
        }
    }
}
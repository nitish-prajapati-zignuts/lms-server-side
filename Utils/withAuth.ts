import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { decodeJsonWebToken } from "./JsonWebToken"

export const withAuth = async () => {
    try {
        const token = (await cookies()).get("auth-token")?.value

        if (!token) {
            redirect("/login")
        }

        const decodedToken = decodeJsonWebToken({ token })

        if (!decodedToken) {
            redirect("/login")
        }

        return decodedToken
    } catch (error) {
        redirect("/login")
    }
}
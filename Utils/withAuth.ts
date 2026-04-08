"use server";

import { verifyJsonWebToken } from "./JsonWebToken";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ResponseState } from "./types";

type Permission = {
    action: string;
    subject: string;
};

type ActionFn<T> = (args: {
    prevState: ResponseState<T> | undefined;
    formData?: FormData;
    user: any;
}) => Promise<ResponseState<T>>;

export function withAuth<T>(
    fn: ActionFn<T>,
    requiredPermission?: Permission
) {
    return async (
        prevState: ResponseState<T> | undefined,
        formData?: FormData
    ): Promise<ResponseState<T>> => {
        try {
            const cookieStore = cookies(); // ✅ no await
            const token = (await cookieStore).get("auth-token")?.value;

            if (!token) {
                redirect("/login");
            }

            let decodedToken;
            try {
                decodedToken = verifyJsonWebToken({ token });
            } catch (error: any) {
                console.error("Token verification failed:", error.message);
                redirect("/login");
            }

            if (!decodedToken) {
                redirect("/login");
            }



            return await fn({
                prevState,
                formData,
                user: decodedToken,
            });

        } catch (error: any) {
            if (
                error.message?.includes("NEXT_REDIRECT") ||
                error.digest?.includes("NEXT_REDIRECT")
            ) {
                throw error;
            }

            console.error("Auth Exception:", error.message);
            redirect("/login");
        }
    };
}
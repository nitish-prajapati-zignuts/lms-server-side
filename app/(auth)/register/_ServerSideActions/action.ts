"use server"
import prisma from "@/_dbConfig/dbConfig"
import { validateForm } from "@/Utils/FormValidator"
import { generateJsonWebToken } from "@/Utils/JsonWebToken"
import { ResponseState } from "@/Utils/types"
import bcrypt from "bcrypt"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"




const registrationSchema = z.object({
    name: z.string().trim().min(3, "Name must be at least 3 characters long"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
})


export async function register(prevState: any, formData: FormData): Promise<ResponseState> {
    try {
        const validation = await validateForm(registrationSchema, formData);

        if (!validation.success) {
            return {
                status: 400,
                success: false,
                message: "",
                errors: validation.errors,
                data: validation.data
            };
        }

        const { name, email, password } = validation.data;

        const existingUser = await prisma.registration.findUnique({
            where: { email }
        });

        if (existingUser) {
            return {
                status: 409,
                success: false,
                message: "A user with this email already exists."
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.registration.create({
            data: {
                name,
                email,
                password: hashedPassword
            },
            select: { id: true, name: true, email: true }
        });

        const token = generateJsonWebToken({ data: { id: newUser.id, email: newUser.email, role: "user" } }) as string

        (await cookies()).set("auth-token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        })


        const ipAddress = (await headers()).get("x-forwarded-for") || ""
        const userAgent = (await headers()).get("user-agent") || ""
        const os = (await headers()).get("sec-ch-ua-platform") || ""

        const createSessions = await prisma.sessions.create({
            data: {
                userId: newUser.id,
                token: token,
                ipAddress: "",
                userAgent: "",
                os: "",
            }
        })

        // return {
        //     status: 201,
        //     success: true,
        //     data: newUser,
        //     message: "User created successfully!"
        // };

    } catch (error) {
        console.error("Registration Error:", error);
        return {
            status: 500,
            success: false,
            message: "An internal server error occurred. Please try again later."
        };
    }

    redirect("/dashboard")
}
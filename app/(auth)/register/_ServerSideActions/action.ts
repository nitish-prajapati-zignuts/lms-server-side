"use server"
import prisma from "@/_dbConfig/dbConfig"
import { validateForm } from "@/Utils/FormValidator"
import bcrypt from "bcrypt"
import { z } from "zod"


export type ResponseState = {
    success: boolean
    status: number
    data?: any
    message: string
    errors?: Record<string, string[]>
}

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

        return {
            status: 201,
            success: true,
            data: newUser,
            message: "User created successfully!"
        };

    } catch (error) {
        console.error("Registration Error:", error);
        return {
            status: 500,
            success: false,
            message: "An internal server error occurred. Please try again later."
        };
    }
}
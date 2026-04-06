"use server"
import prisma from "@/_dbConfig/dbConfig"
import bcrypt from "bcrypt"

export type ResponseState = {
    success: boolean
    status: number
    data?: any
    message: string
}


export async function register(prevState: any, form: FormData): Promise<ResponseState> {
    try {
        const email = form.get("email") as string
        const password = form.get("password") as string
        const name = form.get("name") as string

        //Bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)

        const doesUserExists = await prisma.registration.findUnique({
            where: {
                email: email,
            }
        })

        if (doesUserExists) {
            return {
                status: 401,
                success: false,
                message: "User Already Exists"
            }
        }

        const userdata = await prisma.registration.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })


    } catch (error) {
        return {
            status: 400,
            success: false,
            data: "",
            message: "Something went wrong!"
        }
    }

    return {
        status: 200,
        success: true,
        data: "",
        message: "User Created Successfully"
    }

}
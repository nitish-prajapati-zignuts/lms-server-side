"use server";

import prisma from "@/_dbConfig/dbConfig";
import { validateForm } from "@/Utils/FormValidator";
import { generateJsonWebToken } from "@/Utils/JsonWebToken";
import { ResponseState } from "@/Utils/types";
import bcrypt from "bcrypt";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

export async function login(
  prevState: any,
  form: FormData,
): Promise<ResponseState> {
  try {
    const validation = await validateForm(loginSchema, form);

    if (!validation.success) {
      return {
        status: 400,
        success: false,
        message: "",
        errors: validation.errors,
        data: validation.data
      };
    }

    const { email, password } = validation.data;


    if (!email || !password) {
      return {
        success: false,
        status: 400,
        message: "all Fields require",
      };
    }

    const user = await prisma.registration.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    }

    console.log(user.id)



    //Get Sessions
    const countSessions = await prisma.sessions.findMany({
      where: {
        userId: user.id,
        isDeleted: false,
      },
    })

    if (countSessions.length > 3) {
      return {
        status: 400,
        success: false,
        message: "You have too many sessions active.Please remove some sessions to continue.",
      };
    }

    const token = generateJsonWebToken({ data: { id: user.id, email: user.email, role: user.role } }) as string

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


    await prisma.sessions.create({
      data: {
        userId: user.id,
        token: token,
        ipAddress: ipAddress,
        userAgent: userAgent,
        os: os,
      }
    })

    if (!user) {
      return {
        success: false,
        status: 404,
        message: "User not found",
      };
    }

    const encryptedPassword = await bcrypt.compare(password, user.password);

    if (!encryptedPassword) {
      return {
        status: 401,
        success: false,
        message: "wrong credentials",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: 400,
      success: false,
      data: "",
      message: "Something went wrong!",
    };
  }

  redirect("/dashboard");
}

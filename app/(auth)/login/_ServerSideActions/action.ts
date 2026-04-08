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
        message: "Validation failed",
        errors: validation.errors,
        data: validation.data
      };
    }

    const { email, password } = validation.data;

    if (!email || !password) {
      return {
        success: false,
        status: 400,
        message: "All fields are required",
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

    // 1. Verify password first
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        status: 401,
        success: false,
        message: "Wrong credentials",
      };
    }

    // 2. Check active sessions count
    const activeSessions = await prisma.sessions.findMany({
      where: {
        userId: user.id,
        isDeleted: false,
      },
    });

    if (activeSessions.length >= 3) {
      return {
        status: 400,
        success: false,
        message: "Too many active sessions. Please logout from other devices.",
      };
    }

    // 3. Generate token
    const token = generateJsonWebToken({ 
        data: { id: user.id, email: user.email, role: user.role } 
    }) as string;

    // 4. Set cookie with correct security settings for localhost
    (await cookies()).set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // 5. Create session entry
    const headersList = await headers();
    const ipAddress = headersList.get("x-forwarded-for") || "unknown";
    const userAgent = headersList.get("user-agent") || "unknown";
    const os = headersList.get("sec-ch-ua-platform") || "unknown";

    await prisma.sessions.create({
      data: {
        userId: user.id,
        token: token,
        ipAddress: ipAddress,
        userAgent: userAgent,
        os: os,
      }
    });

  } catch (error: any) {
    if (error.message?.includes("NEXT_REDIRECT") || error.digest?.includes("NEXT_REDIRECT")) {
        throw error;
    }
    console.error("Login Action Exception:", error);
    return {
      status: 500,
      success: false,
      message: "An internal error occurred. Please try again later.",
    };
  }

  redirect("/dashboard");
}


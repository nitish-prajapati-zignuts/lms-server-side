"use server";

import prisma from "@/_dbConfig/dbConfig";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

export type ResponseState = {
  success: boolean;
  status: number;
  data?: any;
  message: string;
};

export async function login(
  prevState: any,
  form: FormData,
): Promise<ResponseState> {
  try {
    const email = form.get("email") as string;
    const password = form.get("password") as string;

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

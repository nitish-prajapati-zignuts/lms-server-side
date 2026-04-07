"use client";

import { useActionState } from "react";
import { login } from "../_ServerSideActions/action";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useRouter } from "next/navigation";

const LoginClient = () => {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(login, {
    success: false,
    status: 200,
    message: "",
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#fafaf9]">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-100/50 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-50/60 blur-[100px]" />

      <Card className="w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl border-white/60 backdrop-blur-md bg-white/80 z-10">
        <CardHeader className="text-center space-y-1.5 pb-8">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-stone-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-stone-500 font-medium">
            Please enter your details to sign in
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-stone-700 font-semibold ml-1">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                className="h-12 rounded-2xl border-stone-200 bg-white/50 focus-visible:ring-amber-200 focus-visible:border-amber-100 transition-all"
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between ml-1">
                <Label htmlFor="password" className="text-stone-700 font-semibold">
                  Password
                </Label>
                <span className="text-xs text-amber-600 font-bold cursor-pointer hover:underline">
                  Forgot Password?
                </span>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                className="h-12 rounded-2xl border-stone-200 bg-white/50 focus-visible:ring-amber-200 focus-visible:border-amber-100 transition-all"
                required
              />
            </div>

            {state?.message && (
              <div className={`p-3 rounded-xl text-center text-sm font-semibold border ${state.success
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-red-50 text-red-600 border-red-100"
                }`}>
                {state.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-2xl text-base font-bold bg-stone-900 hover:bg-stone-800 text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <p className="text-sm text-center text-stone-500 mt-8 font-medium">
            Don’t have an account?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-amber-600 font-bold cursor-pointer hover:text-amber-700 transition-colors hover:underline underline-offset-4"
            >
              Create one
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginClient;
"use client"

import { useActionState } from "react"
import { register } from "../_ServerSideActions/action"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function RegistrationClient() {
    const router = useRouter()

    const [state, formAction, pending] = useActionState(register, {
        success: false,
        status: 200,
        message: "",
        errors: {},
        data: {}
    })

    return (
        /* Warm Creamy Background with Mesh Glows */
        <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-[#fafaf9]">
            {/* Soft Yellowish Radial Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-100/50 blur-[120px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-yellow-50/60 blur-[100px]" />

            <Card className="w-full max-w-md shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl border-white/60 backdrop-blur-md bg-white/80">

                <CardHeader className="text-center space-y-1.5 pb-8">
                    <CardTitle className="text-3xl font-extrabold tracking-tight text-stone-800">
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-stone-500 font-medium">
                        Join our community and start your journey
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form action={formAction} className="space-y-4">

                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="text-stone-700 font-semibold ml-1">Full Name</Label>
                            <Input
                                id="name"
                                name="name"
                                placeholder="Enter your name"
                                className="h-12 rounded-2xl border-stone-200 bg-white/50 focus-visible:ring-amber-200 focus-visible:border-amber-100 transition-all"
                                defaultValue={state.data?.name || ""}
                            />
                            {state.errors?.name && (
                                <p className="text-red-500 text-xs font-medium ml-1">
                                    {state.errors.name[0]}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-stone-700 font-semibold ml-1">Email Address</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                className="h-12 rounded-2xl border-stone-200 bg-white/50 focus-visible:ring-amber-200 focus-visible:border-amber-100 transition-all"
                                defaultValue={state.data?.email || ""}
                            />
                            {state.errors?.email && (
                                <p className="text-red-500 text-xs font-medium ml-1">
                                    {state.errors.email[0]}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <Label htmlFor="password" className="text-stone-700 font-semibold ml-1">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="h-12 rounded-2xl border-stone-200 bg-white/50 focus-visible:ring-amber-200 focus-visible:border-amber-100 transition-all"
                            />
                            {state.errors?.password && (
                                <p className="text-red-500 text-xs font-medium ml-1">
                                    {state.errors.password[0]}
                                </p>
                            )}
                        </div>

                        {/* Status Message */}
                        {state.message && (
                            <div className={`p-3 rounded-xl text-center text-sm font-semibold ${state.success ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                                }`}>
                                {state.message}
                            </div>
                        )}

                        {/* Warm Action Button */}
                        <Button
                            type="submit"
                            disabled={pending}
                            className="w-full h-12 rounded-2xl text-base font-bold bg-stone-900 hover:bg-stone-800 text-white shadow-lg transition-all hover:scale-[1.01] active:scale-[0.98] mt-2 disabled:opacity-50"
                        >
                            {pending ? "Setting things up..." : "Create Account"}
                        </Button>

                        {/* Footer */}
                        <p className="text-sm text-center text-stone-500 pt-2 font-medium">
                            Already have an account?{" "}
                            <span
                                onClick={() => router.push("/login")}
                                className="text-amber-600 font-bold cursor-pointer hover:text-amber-700 transition-colors"
                            >
                                Sign in
                            </span>
                        </p>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
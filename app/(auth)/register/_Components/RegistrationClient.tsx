"use client"

import { useActionState } from "react"
import { register } from "../_ServerSideActions/action"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RegistrationClient() {
    const [state, formAction, pending] = useActionState(register, {
        success: false,
        status: 200,
        message: "",
        errors: {},
        data: {}
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md shadow-xl rounded-2xl">

                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold">
                        Create Account
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                        Enter your details to get started
                    </p>
                </CardHeader>

                <CardContent>
                    <form action={formAction} className="space-y-5">

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Enter your name"
                                className="rounded-xl"
                                defaultValue={state.data?.name || ""}
                            />
                            {state.errors?.name && (
                                <p className="text-red-500 text-sm">
                                    {state.errors.name[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Enter your email"
                                className="rounded-xl"
                                defaultValue={state.data?.email || ""}
                            />
                            {state.errors?.email && (
                                <p className="text-red-500 text-sm">
                                    {state.errors.email[0]}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                name="password"
                                id="password"
                                placeholder="Enter your password"
                                className="rounded-xl"
                            />
                            {state.errors?.password && (
                                <p className="text-red-500 text-sm">
                                    {state.errors.password[0]}
                                </p>
                            )}
                        </div>

                        {state.message && (
                            <p
                                className={`text-sm text-center ${state.success
                                    ? "text-green-600"
                                    : "text-red-500"
                                    }`}
                            >
                                {state.message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full rounded-xl"
                            disabled={pending}
                        >
                            {pending ? "Registering..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
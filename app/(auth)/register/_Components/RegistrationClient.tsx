"use client"

import { useActionState } from "react"
import { register } from "../_ServerSideActions/action"

export default function RegistrationClient() {

    const [state, formAction, pending] = useActionState(register, {
        success: false,
        status: 200,
        message: ""
    })

    return (
        <form action={formAction}>
            <div className="flex flex-col gap-2">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" placeholder="Name" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Password" />
            </div>
            {state.success && <p className="text-green-500">{state.message}</p>}
            <button type="submit">{pending ? "Registering..." : "Register"}</button>
        </form>
    )
}
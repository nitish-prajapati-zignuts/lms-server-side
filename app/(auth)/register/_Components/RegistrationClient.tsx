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
            <input type="text" name="name" placeholder="Name" />
            <input type="email" name="email" placeholder="Email" />
            <input type="password" name="password" placeholder="Password" />
            {state.success && <p className="text-green-500">{state.message}</p>}
            <button type="submit">{pending ? "Registering..." : "Register"}</button>
        </form>
    )
}
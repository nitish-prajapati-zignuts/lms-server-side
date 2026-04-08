"use client"
import { useActionState } from "react"
import { addingRoles } from "./_ServerActions/action"
import { Card } from "@/components/ui/card"

export default function Roles() {

    const [state, formAction, pending] = useActionState(addingRoles, {
        success: false,
        message: "",
        status: 500
    })

    return (
        <div>
            <Card>
                <form action={formAction}>
                    <input type="text" name="role" placeholder="Role" />
                    <button type="submit">Add Role</button>
                </form>
            </Card>
        </div>
    )
}
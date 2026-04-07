import { getDashboardData } from "./_ServerActions/action"

export default async function Dashboard() {
    const data = await getDashboardData()
    console.log("Data from dashboard",data)
    return (
        <div>
            Dashboard
        </div>
    )
}
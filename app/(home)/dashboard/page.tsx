import { AdminDashboardResponse, DashboardResponse, getDashboardData, UserDashboardResponse } from "@/app/(home)/dashboard/_ServerActions/action"
import { ResponseState } from "@/Utils/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Dashboard() {
    const response: ResponseState<DashboardResponse> = await getDashboardData()


    if (response.errors) {
        return (
            <div className="min-h-screen items-center justify-center">
                {response.message}
            </div>
        )
    }


    let data: AdminDashboardResponse | UserDashboardResponse;
    if (response.data?.role === "ADMIN") {
        data = response.data as AdminDashboardResponse
    }
    else {
        data = response.data as UserDashboardResponse
    }


    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome to your dashboard</p>
            </div>

            {/* Cards */}

            {data.role === "ADMIN" ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    {data.totalUsers}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Total Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    {data.totalCourses}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Total Active Users</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    {data.totalActiveUsers}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Enrolled Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    {data.enrolledCourse}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Completed Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    0
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold">
                                    React Native
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Courses Completion %</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-3">
                                <p className="text-2xl font-semibold">66.7%</p>

                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-500 h-3 rounded-full transition-all"
                                        style={{ width: "66.7%" }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        
                    </div>
                </>
            )}
        </div>
    )
}
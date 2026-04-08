export type ResponseState<T = unknown> = {
    success: boolean
    status: number
    data?: T
    message: string
    errors?: Record<string, string[]>
}

export const successResponse = <T>(
    data: T,
    message: string,
    status: number
): ResponseState<T> => {
    return {
        success: true,
        status,
        data,
        message
    }
}

export const errorResponse = <T>(
    message: string,
    status: 500,
    errors?: Record<string, string[]>
): ResponseState<T> => {
    return {
        success: false,
        status,
        errors,
        message
    }
}

export type Role = "ADMIN" | "USER"

export type DashboardMapping = {
    ADMIN: {
        totalUsers: number
        totalCourses: number
        totalActiveUsers: number
    }
    USER: {
        totalCourses: number
        totalCompletedCourses: number
        totalActiveUsers: number
    }
}

export type DashboardResponseMapping<T extends Role> = {
    role: T
} & DashboardMapping[T]
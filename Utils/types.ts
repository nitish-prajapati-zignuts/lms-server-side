export type ResponseState = {
    success: boolean
    status: number
    data?: any
    message: string
    errors?: Record<string, string[]>
    courseId?: string
}
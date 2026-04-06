import { z } from "zod";

export async function validateForm<T extends z.ZodRawShape>(
    schema: z.ZodObject<T>,
    formData: FormData
):
    Promise<{ success: true; data: z.infer<z.ZodObject<T>>; errors: null } | { success: false; data: Record<string, FormDataEntryValue>; errors: Record<string, string[]> }> {
    const rawData = Object.fromEntries(formData.entries());
    const result = schema.safeParse(rawData);

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten().fieldErrors as Record<string, string[]>,
            data: rawData
        };
    }

    return {
        success: true,
        data: result.data,
        errors: null
    };
}
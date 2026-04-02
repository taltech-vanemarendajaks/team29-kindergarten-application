import { z } from "zod";

export const registerSchema = z.object({
    fullName: z
        .string()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name is too long"),

    email: z
        .string()
        .email("Invalid email format"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(100, "Password is too long"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

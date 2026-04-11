import { z } from "zod";

const baseTeacherFormSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name must not exceed 50 characters"),
    email: z.email("Invalid email format"),
    password: z
        .string()
        .max(50, "Password must not exceed 50 characters")
        .optional(),
});

export function createTeacherFormSchema(requirePassword: boolean) {
    return baseTeacherFormSchema.superRefine((values, ctx) => {
        if (requirePassword && !values.password?.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "Password is required",
            });
            return;
        }

        if (values.password && values.password.trim().length < 6) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: "Password must be at least 6 characters",
            });
        }
    });
}

export type TeacherFormValues = z.infer<typeof baseTeacherFormSchema>;

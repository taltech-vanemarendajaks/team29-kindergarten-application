import { z } from "zod";

export const childSchema = z.object({
    firstName: z
        .string()
        .min(2, "First name must be at least 2 characters")
        .max(100, "First name is too long"),
    lastName: z
        .string()
        .min(2, "Last name must be at least 2 characters")
        .max(100, "Last name is too long"),
    birthDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Birth date must be in YYYY-MM-DD format")
        .refine((value) => new Date(value).getTime() < Date.now(), "Birth date must be in the past"),
    groupId: z.preprocess(
        (value) => {
            if (value === "" || value === null || value === undefined) {
                return undefined;
            }

            if (typeof value === "number") {
                return value;
            }

            return Number(value);
        },
        z.number().int("Group ID must be a whole number").positive("Group ID must be positive").optional()
    ),
});

export type ChildFormData = z.infer<typeof childSchema>;

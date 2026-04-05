import { z } from "zod";

export const groupFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Group name is required")
        .max(50, "Group name must not exceed 50 characters"),
    ageRange: z
        .string()
        .max(20, "Age range must not exceed 20 characters")
        .optional()
        .or(z.literal("")),
    teacherId: z.string(),
});

export type GroupFormValues = z.infer<typeof groupFormSchema>;

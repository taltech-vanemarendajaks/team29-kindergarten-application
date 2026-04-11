"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { Controller, useForm } from "react-hook-form";
import { Dialog, Input } from "@/src/components/ui";
import type { Teacher } from "../model/teacher";
import { createTeacherFormSchema, type TeacherFormValues } from "../model/teacherFormSchema";

export type TeacherFormDialogProps = {
    open: boolean;
    title: string;
    submitLabel: string;
    teacher?: Teacher | null;
    loading?: boolean;
    requirePassword?: boolean;
    onCloseAction: () => void;
    onSubmitAction: (values: TeacherFormValues) => Promise<void> | void;
};

export default function TeacherFormDialog({
    open,
    title,
    submitLabel,
    teacher = null,
    loading = false,
    requirePassword = true,
    onCloseAction,
    onSubmitAction,
}: TeacherFormDialogProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<TeacherFormValues>({
        resolver: zodResolver(createTeacherFormSchema(requirePassword)),
        mode: "onChange",
        defaultValues: {
            fullName: teacher?.fullName ?? "",
            email: teacher?.email ?? "",
            password: "",
        },
    });

    const submitForm = handleSubmit((values) =>
        onSubmitAction({
            fullName: values.fullName.trim(),
            email: values.email.trim(),
            password:  values.password?.trim() || undefined,
        }),
    );

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCloseAction}
            title={title}
            actions={[
                {
                    label: "Cancel",
                    onClick: onCloseAction,
                    variant: "text",
                    color: "inherit",
                    disabled: loading,
                },
                {
                    label: loading ? "Saving..." : submitLabel,
                    onClick: () => void submitForm(),
                    disabled: loading || !isValid,
                },
            ]}
        >
            <Stack spacing={2} sx={{ mt: 1 }}>
                <Controller
                    name="fullName"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Full name"
                            required
                            error={!!errors.fullName}
                            helperText={errors.fullName?.message}
                        />
                    )}
                />
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Email"
                            required
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    )}
                />
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Password"
                            type="password"
                            required={requirePassword}
                            error={!!errors.password}
                            helperText={errors.password?.message}
                        />
                    )}
                />
            </Stack>
        </Dialog>
    );
}

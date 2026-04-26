"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Stack from "@mui/material/Stack";
import { Dialog, Input, Select } from "@/src/components/ui";
import { Controller, useForm } from "react-hook-form";
import { formatFullName } from "@/src/shared/utils/formatPersonName";
import type { User } from "@/src/modules/users";
import type { Group } from "../model/group";
import type { UpdateGroupPayload } from "../api/updateGroup";
import { groupFormSchema, type GroupFormValues } from "../model/groupFormSchema";

export type GroupFormDialogProps = {
    open: boolean;
    title: string;
    submitLabel: string;
    group?: Group | null;
    teachers: User[];
    teachersLoading?: boolean;
    teachersError?: string | null;
    loading?: boolean;
    onCloseAction: () => void;
    onSubmitAction: (payload: UpdateGroupPayload) => Promise<void> | void;
};

export default function GroupFormDialog({
    open,
    title,
    submitLabel,
    group = null,
    teachers,
    teachersLoading = false,
    teachersError = null,
    loading = false,
    onCloseAction,
    onSubmitAction,
}: GroupFormDialogProps) {
    const {
        control,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<GroupFormValues>({
        resolver: zodResolver(groupFormSchema),
        mode: "onChange",
        defaultValues: {
            name: group?.name ?? "",
            ageRange: group?.ageRange ?? "",
            teacherId: group?.teacher ? String(group.teacher.id) : "",
        },
    });

    const teacherOptions = [
            { value: "", label: "-- no teacher assigned --" },
            ...teachers.map((teacher) => ({
                value: String(teacher.id),
                label: formatFullName(teacher.fullName),
            })),
    ];

    const submitForm = handleSubmit((values) =>
        onSubmitAction({
            name: values.name.trim(),
            ageRange: values.ageRange?.trim() || null,
            teacherId: values.teacherId ? Number(values.teacherId) : null,
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
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Group name"
                            required
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    )}
                />
                <Controller
                    name="ageRange"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            label="Age range"
                            error={!!errors.ageRange}
                            helperText={errors.ageRange?.message}
                        />
                    )}
                />
                <Controller
                    name="teacherId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label="Teacher"
                            options={teacherOptions}
                            disabled={teachersLoading}
                            error={!!teachersError}
                            helperText={
                                teachersError ??
                                (teachersLoading
                                    ? "Loading teachers..."
                                    : "Only available teachers are shown.")
                            }
                        />
                    )}
                />
            </Stack>
        </Dialog>
    );
}

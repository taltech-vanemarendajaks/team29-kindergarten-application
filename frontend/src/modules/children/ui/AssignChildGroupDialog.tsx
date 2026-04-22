"use client";

import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dialog, Select } from "@/src/components/ui";
import type { Group } from "@/src/modules/groups";
import type { Child } from "../model/child";
import { formatPersonName } from "@/src/shared/utils/formatPersonName";

type AssignChildGroupDialogProps = {
    child: Child | null;
    groups: Group[];
    groupsLoading?: boolean;
    groupsError?: string | null;
    loading?: boolean;
    open: boolean;
    onCloseAction: () => void;
    onSubmitAction: (groupId: number | null) => Promise<void> | void;
};

type AssignChildGroupFormValues = {
    groupId: string;
};

export default function AssignChildGroupDialog({
    child,
    groups,
    groupsLoading = false,
    groupsError = null,
    loading = false,
    open,
    onCloseAction,
    onSubmitAction,
}: AssignChildGroupDialogProps) {
    const {
        control,
        handleSubmit,
        reset,
        formState: { isValid },
    } = useForm<AssignChildGroupFormValues>({
        mode: "onChange",
        defaultValues: {
            groupId: child?.group ? String(child.group.id) : "",
        },
    });

    useEffect(() => {
        reset({
            groupId: child?.group ? String(child.group.id) : "",
        });
    }, [child, reset]);

    const groupOptions = [
        { value: "", label: "-- no group assigned --" },
        ...groups.map((group) => ({
            value: String(group.id),
            label: group.name,
        })),
    ];

    const submitForm = handleSubmit(async (values) => {
        await onSubmitAction(values.groupId ? Number(values.groupId) : null);
    });

    return (
        <Dialog
            open={open}
            onClose={loading ? undefined : onCloseAction}
            title={
                child
                    ? `${child.group ? "Change" : "Assign"} group for ${formatPersonName(child)}`
                    : "Assign group"
            }
            actions={[
                {
                    label: "Cancel",
                    onClick: onCloseAction,
                    variant: "text",
                    color: "inherit",
                    disabled: loading,
                },
                {
                    label: loading ? "Saving..." : "Save",
                    onClick: () => void submitForm(),
                    disabled: loading || !isValid,
                },
            ]}
        >
            <Stack spacing={2} sx={{ mt: 1 }}>
                <Typography color="text.secondary" variant="body2">
                    Select the group this child should be assigned to.
                </Typography>
                <Controller
                    name="groupId"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            label="Group"
                            options={groupOptions}
                            disabled={groupsLoading || groups.length === 0}
                            error={!!groupsError}
                            helperText={groupsError ?? (groupsLoading ? "Loading groups..." : undefined)}
                        />
                    )}
                />
            </Stack>
        </Dialog>
    );
}

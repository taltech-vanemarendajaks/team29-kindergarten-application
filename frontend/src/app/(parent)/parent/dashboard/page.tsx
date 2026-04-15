"use client";

import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import Dialog from "@/src/components/ui/dialog";
import Snackbar from "@/src/components/ui/snackbar";
import { useAuth } from "@/src/context/AuthContext";
import { useChildrenState } from "@/src/context/ChildrenContext";
import { ApiRequestError, createChild } from "@/src/services/children";
import { childSchema, type ChildFormData } from "@/src/validation/childSchema";

function getAgeLabel(birthDate: string | null): string {
    if (!birthDate) {
        return "Unknown";
    }

    const birth = new Date(birthDate);
    if (Number.isNaN(birth.getTime())) {
        return "Unknown";
    }

    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    const dayDiff = now.getDate() - birth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        years -= 1;
    }

    return `${Math.max(years, 0)} y.o.`;
}

export default function ParentDashboardPage() {
    const { token } = useAuth();
    const {
        children,
        isLoading: isChildrenLoading,
        error: childrenLoadError,
        refreshChildren,
    } = useChildrenState();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<z.input<typeof childSchema>, unknown, ChildFormData>({
        resolver: zodResolver(childSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            birthDate: "",
        },
        mode: "onChange",
    });

    const openDialog = () => setIsDialogOpen(true);
    const closeDialog = () => {
        setIsDialogOpen(false);
        reset();
    };

    const showFeedback = (message: string, severity: "success" | "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const onSubmit = async (data: ChildFormData) => {
        if (!token) {
            showFeedback("You need to sign in before adding a child.", "error");
            return;
        }

        try {
            await createChild(data, token);
            await refreshChildren();
            closeDialog();
            showFeedback("Child added successfully", "success");
        } catch (error) {
            if (error instanceof ApiRequestError) {
                if (error.status === 401 || error.status === 403) {
                    showFeedback("Session expired or access denied. Sign in again.", "error");
                    return;
                }

                if (error.status === 400) {
                    showFeedback(error.message || "Validation failed. Check input values.", "error");
                    return;
                }
            }

            showFeedback("Failed to add child. Please try again.", "error");
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight={700}>
                    Parent Dashboard
                </Typography>

                <Typography>
                    Welcome! Here you can manage your child’s activities.
                </Typography>

                <Stack direction="row" spacing={1}>
                    <Button onClick={openDialog} sx={{ alignSelf: "flex-start" }} variant="contained">
                        Add Child
                    </Button>
                    <Button component={Link} href="/parent/children" variant="outlined">
                        Open Children Page
                    </Button>
                </Stack>

                {isChildrenLoading ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} />
                        <Typography color="text.secondary">Loading children...</Typography>
                    </Stack>
                ) : null}

                {childrenLoadError ? <Typography color="error.main">{childrenLoadError}</Typography> : null}

                {!isChildrenLoading && children.length === 0 && token ? (
                    <Typography color="text.secondary">
                        No children found yet. Use Add Child to create one.
                    </Typography>
                ) : null}

                {children.length > 0 && (
                    <Stack spacing={1}>
                        <Typography variant="h6">Children</Typography>
                        {children.map((child) => (
                            <Box
                                key={child.id}
                                sx={{
                                    p: 1.5,
                                    border: "1px solid",
                                    borderColor: "divider",
                                    borderRadius: 1,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                }}
                            >
                                <Typography>
                                    {child.firstName} {child.lastName} - {child.birthDate ?? "Not set"} (
                                    {getAgeLabel(child.birthDate)})
                                    {child.groupId
                                        ? ` (${child.groupName && child.groupName.trim().length > 0 ? child.groupName : `Group #${child.groupId}`})`
                                        : ""}
                                </Typography>
                                <Button
                                    component={Link}
                                    href={`/parent/children?childId=${child.id}`}
                                    variant="outlined"
                                    size="small"
                                >
                                    Open
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Stack>

            <Dialog
                open={isDialogOpen}
                onClose={closeDialog}
                title="Add Child"
                actions={[
                    {
                        label: "Cancel",
                        onClick: closeDialog,
                        variant: "outlined",
                        color: "inherit",
                    },
                    {
                        label: "Create",
                        onClick: handleSubmit(onSubmit),
                        disabled: isSubmitting || !isValid,
                    },
                ]}
            >
                <Stack component="form" spacing={2} sx={{ pt: 1 }}>
                    <TextField
                        label="First Name"
                        {...register("firstName")}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                        fullWidth
                    />

                    <TextField
                        label="Last Name"
                        {...register("lastName")}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                        fullWidth
                    />

                    <TextField
                        label="Birth Date"
                        type="date"
                        {...register("birthDate")}
                        error={!!errors.birthDate}
                        helperText={errors.birthDate?.message}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />

                    <TextField
                        label="Group ID (optional)"
                        type="number"
                        {...register("groupId", {
                            setValueAs: (value) => (value === "" ? undefined : Number(value)),
                        })}
                        error={!!errors.groupId}
                        helperText={errors.groupId?.message}
                        fullWidth
                    />
                </Stack>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Paper>
    );
}
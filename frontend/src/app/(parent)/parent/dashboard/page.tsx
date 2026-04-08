"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import Dialog from "@/src/components/ui/dialog";
import Snackbar from "@/src/components/ui/snackbar";
import { useAuth } from "@/src/context/AuthContext";
import { ApiRequestError, createChild, getMyParentProfile } from "@/src/services/children";
import { childSchema, type ChildFormData } from "@/src/validation/childSchema";

export default function ParentDashboardPage() {
    const { token } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [parentId, setParentId] = useState<number | null>(null);
    const [isParentLoading, setIsParentLoading] = useState(false);
    const [parentLoadError, setParentLoadError] = useState<string | null>(null);
    const [localChildren, setLocalChildren] = useState<
        Array<ChildFormData & { id: string; source: "api" | "local" }>
    >([]);

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

    useEffect(() => {
        if (!token) {
            setParentId(null);
            setParentLoadError(null);
            setIsParentLoading(false);
            return;
        }

        const loadParentProfile = async () => {
            try {
                setIsParentLoading(true);
                setParentLoadError(null);
                const profile = await getMyParentProfile(token);
                setParentId(profile.id);
            } catch (error) {
                setParentId(null);
                if (error instanceof ApiRequestError && error.status === 404) {
                    setParentLoadError("Parent profile not found. Ask administrator to create parent record.");
                    return;
                }
                setParentLoadError("Failed to load parent profile. Try again later.");
            } finally {
                setIsParentLoading(false);
            }
        };

        void loadParentProfile();
    }, [token]);

    const addLocalChild = (data: ChildFormData, source: "api" | "local") => {
        setLocalChildren((prev) => [
            {
                ...data,
                source,
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            },
            ...prev,
        ]);
    };

    const onSubmit = async (data: ChildFormData) => {
        if (!token) {
            showFeedback("You need to sign in before adding a child.", "error");
            return;
        }

        if (isParentLoading) {
            showFeedback("Parent profile is still loading. Please wait a moment.", "error");
            return;
        }

        if (!parentId) {
            showFeedback(parentLoadError ?? "Parent profile is not available.", "error");
            return;
        }

        try {
            await createChild(data, token, parentId);
            addLocalChild(data, "api");
            closeDialog();
            showFeedback("Child added successfully", "success");
        } catch (error) {
            if (error instanceof ApiRequestError) {
                if (error.status === 404) {
                    showFeedback("Parent profile was not found on backend.", "error");
                    return;
                }

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

                {parentLoadError ? <Typography color="error.main">{parentLoadError}</Typography> : null}

                <Stack direction="row" spacing={1}>
                    <Button onClick={openDialog} sx={{ alignSelf: "flex-start" }} variant="contained">
                        Add Child
                    </Button>
                    <Button component={Link} href="/parent/children" variant="outlined">
                        Open Children Page
                    </Button>
                </Stack>

                {localChildren.length > 0 && (
                    <Stack spacing={1}>
                        <Typography variant="h6">Children (temporary local list)</Typography>
                        {localChildren.map((child) => (
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
                                    {child.firstName} {child.lastName} - {child.birthDate}
                                    {child.groupId ? ` (Group #${child.groupId})` : ""}
                                </Typography>
                                <Chip
                                    label={child.source === "api" ? "api" : "local/mock"}
                                    color={child.source === "api" ? "success" : "warning"}
                                    size="small"
                                />
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
                        disabled: isSubmitting || !isValid || isParentLoading,
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
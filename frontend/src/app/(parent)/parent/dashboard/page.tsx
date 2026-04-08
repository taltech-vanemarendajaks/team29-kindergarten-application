"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Box, Button, Chip, Paper, Stack, TextField, Typography } from "@mui/material";
import Dialog from "@/src/components/ui/dialog";
import Snackbar from "@/src/components/ui/snackbar";
import { useAuth } from "@/src/context/AuthContext";
import { createChild } from "@/src/services/children";
import { childSchema, type ChildFormData } from "@/src/validation/childSchema";

export default function ParentDashboardPage() {
    const { token } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [localChildren, setLocalChildren] = useState<
        Array<ChildFormData & { id: string; source: "api" | "local" }>
    >([]);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ChildFormData>({
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
            addLocalChild(data, "local");
            closeDialog();
            showFeedback("API auth missing. Child created locally for testing.", "success");
            return;
        }

        try {
            await createChild(data, token);
            addLocalChild(data, "api");
            closeDialog();
            showFeedback("Child added successfully", "success");
        } catch {
            addLocalChild(data, "local");
            closeDialog();
            showFeedback("API rejected request. Created locally for testing.", "success");
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

                <Button onClick={openDialog} sx={{ alignSelf: "flex-start" }} variant="contained">
                    Add Child
                </Button>

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
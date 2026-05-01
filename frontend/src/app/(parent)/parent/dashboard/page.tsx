"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Dialog from "@/src/components/ui/dialog";
import Snackbar from "@/src/components/ui/snackbar";
import { useAuth } from "@/src/context/AuthContext";
import { useChildrenState } from "@/src/context/ChildrenContext";
import { childFormSchema, type ChildFormValues, createChild } from "@/src/modules/parents";
import { ApiRequestError } from "@/src/shared/utils/apiRequestError";
import { useWebSocketConnection } from "@/src/components/hooks/useWebSocketConnection";
import { WsEvent } from "@/src/modules/announcements/types/ws";
import { getParentJournalEntries } from "@/src/modules/parents/api/getJournalEntry";
import type { DailyJournalEntry } from "@/src/modules/teachers/model/dailyJournalEntry";
import { format } from "date-fns";
import { getUserOptionsByRole } from "@/src/modules/users/api/getUsers";

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

function getTimelineLabel(value: string): string {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return "Unknown time";
    }

    // Some feeds provide date-only values; show date in that case instead of 12:00 AM.
    if (!value.includes("T")) {
        return format(parsed, "dd MMM");
    }

    return format(parsed, "hh:mm a");
}

export default function ParentDashboardPage() {
    const { token, userId } = useAuth();
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
    const [parentName, setParentName] = useState("Parent");
    const [journalEntries, setJournalEntries] = useState<DailyJournalEntry[]>([]);
    const [isJournalLoading, setIsJournalLoading] = useState(false);
    const [journalError, setJournalError] = useState<string | null>(null);
    useEffect(() => {
        if (!token || !userId) {
            setParentName("Parent");
            return;
        }

        let isMounted = true;
        const loadParentName = async () => {
            try {
                const parents = await getUserOptionsByRole(token, "PARENT");
                if (!isMounted) {
                    return;
                }
                const currentParent = parents.find((parent) => parent.id === userId);
                const resolvedName = currentParent?.fullName?.trim();
                setParentName(resolvedName && resolvedName.length > 0 ? resolvedName : "Parent");
            } catch {
                if (isMounted) {
                    setParentName("Parent");
                }
            }
        };

        void loadParentName();
        return () => {
            isMounted = false;
        };
    }, [token, userId]);

   
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<z.input<typeof childFormSchema>, unknown, ChildFormValues>({
        resolver: zodResolver(childFormSchema),
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

    const [toastVersion, setToastVersion] = useState(0);

    const showFeedback = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
    setToastVersion((v) => v + 1); // 🔥 forces re-render lifecycle
    };

/*
useWebSocketConnection((msg) => {
    console.log("RAW MSG:", msg);

    showFeedback("TEST TOAST", "success");
});

/** */

    useWebSocketConnection((msg: WsEvent) => {
    console.log("RAW MSG:", msg);

    switch (msg.type) {
        case "ANNOUNCEMENT_CREATED":
            showFeedback(msg.payload.title, "success");
            break;

        case "NEW_MESSAGE":
            showFeedback("New message received", "success");
            break;
    }
});    

    const onSubmit = async (data: ChildFormValues) => {
        if (!token) {
            showFeedback("You need to sign in before adding a child.", "error");
            return;
        }

        try {
            await createChild(token, data);
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

    useEffect(() => {
        if (!token) {
            setJournalEntries([]);
            setJournalError(null);
            setIsJournalLoading(false);
            return;
        }

        let isMounted = true;
        const loadJournalEntries = async () => {
            try {
                setIsJournalLoading(true);
                setJournalError(null);
                const entries = await getParentJournalEntries(token);
                if (!isMounted) {
                    return;
                }
                const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
                setJournalEntries(sorted.slice(0, 5));
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                if (error instanceof Error && error.message.trim().length > 0) {
                    setJournalError(error.message);
                } else {
                    setJournalError("Failed to load daily journal feed.");
                }
            } finally {
                if (isMounted) {
                    setIsJournalLoading(false);
                }
            }
        };

        void loadJournalEntries();
        return () => {
            isMounted = false;
        };
    }, [token]);

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight={700}>
                    Parent Dashboard
                </Typography>

                <Typography>{`Welcome, ${parentName}! Here you can manage your child’s activities.`}</Typography>

                <Stack direction="row" spacing={1}>
                    <Button
                        onClick={openDialog}
                        sx={{ alignSelf: "flex-start", textTransform: "none", fontWeight: 500, fontSize: "0.875rem" }}
                        variant="contained"
                        startIcon={<EditOutlinedIcon fontSize="small" />}
                    >
                        Add Child
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
                                    {child.group
                                        ? ` (${child.group.name && child.group.name.trim().length > 0 ? child.group.name : `Group #${child.group.id}`})`
                                        : ""}
                                </Typography>
                                <Button
                                    component={Link}
                                    href={`/parent/children?childId=${child.id}`}
                                    variant="outlined"
                                    size="small"
                                    sx={{ minWidth: "auto", px: 1, minHeight: 28 }}
                                    aria-label="Open child profile"
                                >
                                    <VisibilityOutlinedIcon fontSize="small" />
                                </Button>
                            </Box>
                        ))}
                    </Stack>
                )}

                <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6">Daily Journal Feed</Typography>
                            <Button
                                component={Link}
                                href="/parent/journal"
                                variant="outlined"
                                size="small"
                                endIcon={<ArrowForwardIcon fontSize="small" />}
                                sx={{ textTransform: "none", fontWeight: 500, fontSize: "0.875rem" }}
                            >
                                View History
                            </Button>
                        </Stack>

                        {isJournalLoading ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <CircularProgress size={18} />
                                <Typography color="text.secondary">Loading timeline...</Typography>
                            </Stack>
                        ) : null}

                        {journalError ? <Typography color="error.main">{journalError}</Typography> : null}

                        {!isJournalLoading && !journalError && journalEntries.length === 0 ? (
                            <Typography color="text.secondary">
                                No journal entries yet. New updates from teachers will appear here.
                            </Typography>
                        ) : null}

                        {!isJournalLoading && !journalError && journalEntries.length > 0 ? (
                            <Stack spacing={0}>
                                {journalEntries.map((entry, index) => (
                                    <Box key={entry.id} sx={{ display: "flex", gap: 1.5, py: 2 }}>
                                        <Stack alignItems="center" sx={{ minWidth: 28 }}>
                                            <CheckCircleIcon color="primary" fontSize="small" />
                                            {index < journalEntries.length - 1 ? (
                                                <Box
                                                    sx={{
                                                        width: 2,
                                                        flex: 1,
                                                        bgcolor: "primary.main",
                                                        opacity: 0.45,
                                                        mt: 0.75,
                                                        minHeight: 24,
                                                    }}
                                                />
                                            ) : null}
                                        </Stack>

                                        <Stack spacing={0.5} sx={{ flex: 1 }}>
                                            <Typography fontWeight={600}>{entry.summary}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {entry.milestones}
                                            </Typography>
                                        </Stack>

                                        <Stack alignItems="flex-end" spacing={0.75}>
                                            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                                                {getTimelineLabel(entry.date)}
                                            </Typography>
                                            <Button
                                                component={Link}
                                                href={`/parent/journal/${entry.id}`}
                                                variant="outlined"
                                                size="small"
                                                sx={{ minWidth: "auto", px: 1, minHeight: 28 }}
                                                aria-label="Open journal entry"
                                            >
                                                <VisibilityOutlinedIcon fontSize="small" />
                                            </Button>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        ) : null}
                    </Stack>
                </Paper>
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
                        color: "primary",
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
  key={toastVersion}
  open={snackbarOpen}
  onClose={() => setSnackbarOpen(false)}
  message={snackbarMessage}
  severity={snackbarSeverity}
  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
/>
        </Paper>
    );
}

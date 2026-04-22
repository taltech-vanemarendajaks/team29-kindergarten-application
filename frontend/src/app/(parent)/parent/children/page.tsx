"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Tab,
    Tabs,
    TextField,
    Typography,
} from "@mui/material";
import Dialog from "@/src/components/ui/dialog";
import Snackbar from "@/src/components/ui/snackbar";
import AttendanceTab from "@/src/components/attendance/AttendanceTab";
import { useAuth } from "@/src/context/AuthContext";
import { useChildrenState } from "@/src/context/ChildrenContext";
import { getGroups } from "@/src/modules/groups/api/getGroups";
import type { Group } from "@/src/modules/groups/model/group";
import { type Child, getChildById, updateChild } from "@/src/modules/parents";
import { ApiRequestError } from "@/src/shared/utils/apiRequestError";

type ProfileTab = "profile" | "attendance" | "development";

function resolveInitialTab(rawTab: string | null): ProfileTab {
    if (rawTab === "attendance" || rawTab === "development" || rawTab === "profile") {
        return rawTab;
    }

    return "profile";
}

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

export default function ParentChildrenPage() {
    const { token } = useAuth();
    const {
        children,
        isLoading: isLoadingChildren,
        error: childrenLoadError,
        upsertChild,
    } = useChildrenState();
    const searchParams = useSearchParams();
    const initialChildIdParam = searchParams.get("childId");
    const initialTabParam = searchParams.get("tab");
    // The URL `?childId=` value must seed the selection only on the first render
    // that has children available. Re-applying it every time `children` changes
    // would overwrite the user's manual selection each time the profile is refetched
    // and `upsertChild` replaces the item in the children list.
    const initialChildIdAppliedRef = useRef(false);
    const [tab, setTab] = useState<ProfileTab>(() => resolveInitialTab(initialTabParam));
    const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [groupsLoadError, setGroupsLoadError] = useState<string | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editBirthDate, setEditBirthDate] = useState("");
    const [editGroupId, setEditGroupId] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [profileError, setProfileError] = useState<string | null>(null);

    const showFeedback = (message: string, severity: "success" | "error") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const resolveGroupLabel = (child: Child): string => {
        if (!child.groupId) {
            return "Group not assigned";
        }

        if (child.groupName && child.groupName.trim().length > 0) {
            return child.groupName;
        }

        return `Group #${child.groupId}`;
    };

    const loadGroups = async (authToken: string) => {
        setIsLoadingGroups(true);
        setGroupsLoadError(null);

        try {
            const page = await getGroups(authToken, 0, 100);
            setGroups(page.content);
        } catch {
            setGroups([]);
            setGroupsLoadError("Full groups list is unavailable for your account. Showing known groups only.");
        } finally {
            setIsLoadingGroups(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setGroups([]);
            return;
        }

        void loadGroups(token);
    }, [token]);

    useEffect(() => {
        if (children.length === 0) {
            setSelectedChildId(null);
            initialChildIdAppliedRef.current = false;
            return;
        }

        setSelectedChildId((currentId) => {
            if (currentId !== null && children.some((child) => child.id === currentId)) {
                return currentId;
            }

            if (!initialChildIdAppliedRef.current && initialChildIdParam) {
                const parsedChildId = Number(initialChildIdParam);
                if (Number.isInteger(parsedChildId) && children.some((child) => child.id === parsedChildId)) {
                    initialChildIdAppliedRef.current = true;
                    return parsedChildId;
                }
            }

            initialChildIdAppliedRef.current = true;
            return children[0]?.id ?? null;
        });
    }, [children, initialChildIdParam]);

    useEffect(() => {
        if (!isLoadingProfile) {
            setShowLoadingIndicator(false);
            return;
        }

        // Avoid a flash of the spinner for quick profile loads; only show the
        // "Loading profile details..." indicator if the request actually takes a while.
        const timeoutId = window.setTimeout(() => setShowLoadingIndicator(true), 400);
        return () => window.clearTimeout(timeoutId);
    }, [isLoadingProfile]);

    useEffect(() => {
        if (!token || !selectedChildId) {
            setSelectedChild(null);
            return;
        }

        const cachedChild = children.find((item) => item.id === selectedChildId) ?? null;
        if (cachedChild) {
            // Keep previous content visible while full profile is refreshed to avoid layout jumps.
            setSelectedChild(cachedChild);
        }

        const loadChildProfile = async () => {
            try {
                setIsLoadingProfile(true);
                setProfileError(null);
                const child = await getChildById(token, selectedChildId);
                setSelectedChild(child);
                upsertChild(child);
            } catch {
                const fallback = children.find((item) => item.id === selectedChildId) ?? null;
                setSelectedChild(fallback);
                setProfileError("Failed to load full child profile. Showing list data.");
            } finally {
                setIsLoadingProfile(false);
            }
        };

        void loadChildProfile();
    }, [token, selectedChildId]);

    const fullName = useMemo(() => {
        if (!selectedChild) {
            return "";
        }
        return `${selectedChild.firstName} ${selectedChild.lastName}`;
    }, [selectedChild]);

    const groupLabel = useMemo(() => {
        if (!selectedChild) {
            return "Group not assigned";
        }

        return resolveGroupLabel(selectedChild);
    }, [selectedChild]);

    const groupOptions = useMemo(() => {
        const merged = new Map<number, string>();

        groups.forEach((group) => {
            merged.set(group.id, group.name);
        });

        children.forEach((child) => {
            if (!child.groupId) {
                return;
            }

            const knownName =
                child.groupName && child.groupName.trim().length > 0 ? child.groupName : `Group #${child.groupId}`;
            if (!merged.has(child.groupId)) {
                merged.set(child.groupId, knownName);
            }
        });

        if (selectedChild?.groupId && !merged.has(selectedChild.groupId)) {
            merged.set(selectedChild.groupId, resolveGroupLabel(selectedChild));
        }

        return Array.from(merged.entries())
            .map(([id, name]) => ({ id, name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [groups, children, selectedChild]);

    const openEditDialog = () => {
        if (!selectedChild) {
            return;
        }

        setEditFirstName(selectedChild.firstName);
        setEditLastName(selectedChild.lastName);
        setEditBirthDate(selectedChild.birthDate ?? "");
        setEditGroupId(selectedChild.groupId ? String(selectedChild.groupId) : "");
        setIsEditDialogOpen(true);
    };

    const closeEditDialog = () => {
        if (isSavingEdit) {
            return;
        }
        setIsEditDialogOpen(false);
    };

    const handleSaveEdit = async () => {
        if (!token || !selectedChild) {
            showFeedback("Please sign in to edit child profile.", "error");
            return;
        }

        const normalizedFirstName = editFirstName.trim();
        const normalizedLastName = editLastName.trim();
        const normalizedBirthDate = editBirthDate.trim();

        if (normalizedFirstName.length < 2 || normalizedLastName.length < 2) {
            showFeedback("First and last names must contain at least 2 characters.", "error");
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(normalizedBirthDate)) {
            showFeedback("Birth date must be in YYYY-MM-DD format.", "error");
            return;
        }

        if (new Date(normalizedBirthDate).getTime() >= Date.now()) {
            showFeedback("Birth date must be in the past.", "error");
            return;
        }

        const parsedGroupId = editGroupId === "" ? undefined : Number(editGroupId);
        if (parsedGroupId !== undefined && (!Number.isInteger(parsedGroupId) || parsedGroupId <= 0)) {
            showFeedback("Please select a valid group.", "error");
            return;
        }

        try {
            setIsSavingEdit(true);

            const updatedChild = await updateChild(token, selectedChild.id, {
                firstName: normalizedFirstName,
                lastName: normalizedLastName,
                birthDate: normalizedBirthDate,
                groupId: parsedGroupId,
            });

            setSelectedChild(updatedChild);
            upsertChild(updatedChild);
            setIsEditDialogOpen(false);
            showFeedback("Child profile updated successfully.", "success");
        } catch (updateError) {
            if (updateError instanceof ApiRequestError) {
                showFeedback(updateError.message, "error");
                return;
            }
            showFeedback("Failed to update child profile. Please try again.", "error");
        } finally {
            setIsSavingEdit(false);
        }
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight={700}>
                    Child Profile
                </Typography>

                {!token ? (
                    <Typography color="text.secondary">
                        Please sign in to load child profiles from the backend.
                    </Typography>
                ) : null}

                {isLoadingChildren ? (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} />
                        <Typography color="text.secondary">Loading children...</Typography>
                    </Stack>
                ) : null}

                {childrenLoadError ? <Typography color="error.main">{childrenLoadError}</Typography> : null}
                {profileError ? <Typography color="error.main">{profileError}</Typography> : null}

                {!isLoadingChildren && children.length === 0 && token ? (
                    <Typography color="text.secondary">
                        No children found yet. Use Add Child from dashboard to create one.
                    </Typography>
                ) : null}

                {children.length > 0 ? (
                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                        {children.map((child) => (
                            <Chip
                                key={child.id}
                                label={`${child.firstName} ${child.lastName}`}
                                variant={selectedChildId === child.id ? "filled" : "outlined"}
                                color={selectedChildId === child.id ? "primary" : "default"}
                                onClick={() => setSelectedChildId(child.id)}
                            />
                        ))}
                    </Stack>
                ) : null}

                {selectedChild ? (
                    <Stack spacing={2}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                                <Avatar sx={{ width: 72, height: 72 }}>
                                    {selectedChild.firstName.slice(0, 1)}
                                </Avatar>

                                <Box>
                                    <Typography variant="h5" fontWeight={700}>
                                        {fullName}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {getAgeLabel(selectedChild.birthDate)} -{" "}
                                        {groupLabel}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Birth date: {selectedChild.birthDate ?? "Not set"}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Tabs
                                value={tab}
                                onChange={(_, value: ProfileTab) => setTab(value)}
                                sx={{ mb: 1 }}
                            >
                                <Tab value="profile" label="Profile" />
                                <Tab value="attendance" label="Attendance" />
                                <Tab value="development" label="Development" />
                            </Tabs>

                            {showLoadingIndicator ? (
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 2 }}>
                                    <CircularProgress size={16} />
                                    <Typography color="text.secondary">Loading profile details...</Typography>
                                </Stack>
                            ) : null}

                            {!showLoadingIndicator && tab === "profile" ? (
                                <Stack spacing={1}>
                                    <Button variant="outlined" onClick={openEditDialog} sx={{ alignSelf: "flex-start" }}>
                                        Edit Profile
                                    </Button>
                                    <Typography>
                                        First name: <strong>{selectedChild.firstName}</strong>
                                    </Typography>
                                    <Typography>
                                        Last name: <strong>{selectedChild.lastName}</strong>
                                    </Typography>
                                    <Typography>
                                        Birth date: <strong>{selectedChild.birthDate ?? "Not set"}</strong>
                                    </Typography>
                                    <Typography>
                                        Age: <strong>{getAgeLabel(selectedChild.birthDate)}</strong>
                                    </Typography>
                                    <Typography>
                                        Group:{" "}
                                        <strong>
                                            {selectedChild.groupId ? groupLabel : "Not assigned"}
                                        </strong>
                                    </Typography>
                                </Stack>
                            ) : null}

                            {tab === "attendance" ? (
                                <AttendanceTab childId={selectedChild.id} />
                            ) : null}

                            {tab === "development" ? (
                                <Typography color="text.secondary">
                                    Stage 3 placeholder: milestones and highlights will be added once backend models are ready.
                                </Typography>
                            ) : null}
                        </Paper>
                    </Stack>
                ) : null}

                <Button component={Link} href="/parent/dashboard" variant="outlined" sx={{ alignSelf: "flex-start" }}>
                    Back to Dashboard
                </Button>
            </Stack>

            <Dialog
                open={isEditDialogOpen}
                onClose={closeEditDialog}
                title="Edit Child Profile"
                actions={[
                    {
                        label: "Cancel",
                        onClick: closeEditDialog,
                        variant: "outlined",
                        color: "inherit",
                        disabled: isSavingEdit,
                    },
                    {
                        label: isSavingEdit ? "Saving..." : "Save",
                        onClick: () => {
                            void handleSaveEdit();
                        },
                        disabled: isSavingEdit,
                    },
                ]}
            >
                <Stack spacing={2} sx={{ pt: 1 }}>
                    <TextField
                        label="First Name"
                        value={editFirstName}
                        onChange={(event) => setEditFirstName(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Last Name"
                        value={editLastName}
                        onChange={(event) => setEditLastName(event.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Birth Date"
                        type="date"
                        value={editBirthDate}
                        onChange={(event) => setEditBirthDate(event.target.value)}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                    />
                    <FormControl fullWidth>
                        <InputLabel id="edit-child-group-label">Group</InputLabel>
                        <Select
                            labelId="edit-child-group-label"
                            label="Group"
                            value={editGroupId}
                            onChange={(event) => setEditGroupId(event.target.value)}
                            disabled={isLoadingGroups}
                        >
                            <MenuItem value="">Not assigned</MenuItem>
                            {groupOptions.map((group) => (
                                <MenuItem key={group.id} value={String(group.id)}>
                                    {group.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {groupsLoadError ? (
                        <Typography variant="body2" color="warning.main">
                            {groupsLoadError}
                        </Typography>
                    ) : null}
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

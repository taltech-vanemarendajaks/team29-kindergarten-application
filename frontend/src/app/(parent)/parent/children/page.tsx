"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Paper,
    Stack,
    Tab,
    Tabs,
    Typography,
} from "@mui/material";
import { useAuth } from "@/src/context/AuthContext";
import { ChildDto, getChildById, getChildren } from "@/src/services/children";

type ProfileTab = "profile" | "attendance" | "development";

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
    const { token, tenantId } = useAuth();
    const [tab, setTab] = useState<ProfileTab>("profile");
    const [children, setChildren] = useState<ChildDto[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
    const [selectedChild, setSelectedChild] = useState<ChildDto | null>(null);
    const [isLoadingChildren, setIsLoadingChildren] = useState(true);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token || !tenantId) {
            setIsLoadingChildren(false);
            return;
        }

        const loadChildren = async () => {
            try {
                setError(null);
                setIsLoadingChildren(true);
                const page = await getChildren(token, tenantId);
                setChildren(page.content);
                setSelectedChildId(page.content[0]?.id ?? null);
            } catch {
                setError("Failed to load children from API.");
            } finally {
                setIsLoadingChildren(false);
            }
        };

        void loadChildren();
    }, [token, tenantId]);

    useEffect(() => {
        if (!token || !tenantId || !selectedChildId) {
            setSelectedChild(null);
            return;
        }

        const loadChildProfile = async () => {
            try {
                setIsLoadingProfile(true);
                const child = await getChildById(token, selectedChildId, tenantId);
                setSelectedChild(child);
            } catch {
                const fallback = children.find((item) => item.id === selectedChildId) ?? null;
                setSelectedChild(fallback);
                setError("Failed to load full child profile. Showing list data.");
            } finally {
                setIsLoadingProfile(false);
            }
        };

        void loadChildProfile();
    }, [token, tenantId, selectedChildId, children]);

    const fullName = useMemo(() => {
        if (!selectedChild) {
            return "";
        }
        return `${selectedChild.firstName} ${selectedChild.lastName}`;
    }, [selectedChild]);

    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight={700}>
                    Child Profile
                </Typography>

                {!token || !tenantId ? (
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

                {error ? <Typography color="error.main">{error}</Typography> : null}

                {!isLoadingChildren && children.length === 0 && token && tenantId ? (
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
                                        {selectedChild.groupId ? `Group #${selectedChild.groupId}` : "Group not assigned"}
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

                            {isLoadingProfile ? (
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CircularProgress size={16} />
                                    <Typography color="text.secondary">Loading profile details...</Typography>
                                </Stack>
                            ) : null}

                            {tab === "profile" ? (
                                <Stack spacing={1}>
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
                                            {selectedChild.groupId ? `#${selectedChild.groupId}` : "Not assigned"}
                                        </strong>
                                    </Typography>
                                </Stack>
                            ) : null}

                            {tab === "attendance" ? (
                                <Typography color="text.secondary">
                                    Stage 2 placeholder: attendance and parent/group context will be added next.
                                </Typography>
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
        </Paper>
    );
}

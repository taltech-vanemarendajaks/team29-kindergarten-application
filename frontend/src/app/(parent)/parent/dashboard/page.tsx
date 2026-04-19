"use client";

import {useCallback, useEffect, useState} from "react";
import { useAuth } from "@/src/context/AuthContext";

import {
    Paper,
    Typography,
    Stack,
    Card,
    CardContent,
    CardMedia,
    Skeleton,
    ImageList,
    ImageListItem, Box, Button,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import { motion } from "framer-motion";
import { format } from "date-fns";
import { getParentJournalEntries } from "@/src/modules/parent/api/getJournalEntry";
import {DailyJournalEntry} from "@/src/modules/teachers/model/dailyJournalEntry";
import Link from "next/link";

export default function ParentJournalFeed() {
    const { token } = useAuth();

    const [entries, setEntries] = useState<DailyJournalEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadEntries = useCallback(async () => {
        setLoading(true);
        try {
            if (!token) {
                setError("Not authenticated");
                return;
            }
            const data = await getParentJournalEntries(token);
            setEntries(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unknown error");
            }
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            loadEntries().then(r => {});
        }
    }, [token, loadEntries]);

    // --- Loading skeleton ---
    if (loading) {
        return (
            <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Daily Journal Feed
                </Typography>

                <Stack spacing={3}>
                    {[1, 2, 3].map((i) => (
                        <Card key={i} sx={{ display: "flex", gap: 2, p: 2 }}>
                            <Skeleton variant="rectangular" width={120} height={120} />
                            <CardContent sx={{ flex: 1 }}>
                                <Skeleton width="40%" />
                                <Skeleton width="80%" sx={{ mt: 1 }} />
                                <Skeleton width="60%" sx={{ mt: 1 }} />
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Paper>
        );
    }

    // error state
    if (error) {
        return (
            <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Daily Journal Feed
                </Typography>
                <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                </Typography>
            </Paper>
        );
    }

    // empty feed
    if (entries.length === 0) {
        return (
            <Paper sx={{ p: 3, maxWidth: 900, mx: "auto", textAlign: "center" }}>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Daily Journal Feed
                </Typography>
                <Typography sx={{ opacity: 0.7 }}>
                    No journal entries yet.
                    Your teacher will post updates here.
                </Typography>
            </Paper>
        );
    }

    // group entries by date
    const grouped = entries.reduce<Record<string, DailyJournalEntry[]>>(
        (acc, entry) => {
            const date = entry.date;
            if (!acc[date]) acc[date] = [];
            acc[date].push(entry);
            return acc;
        },
        {}
    );

    return (
        <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Daily Journal Feed
            </Typography>

            <Stack spacing={4}>
                {Object.entries(grouped).map(([date, items]: [string, DailyJournalEntry[]]) => (
                    <div key={date}>
                        <Typography
                            variant="h6"
                            sx={{ mb: 2, opacity: 0.6 }}
                        >
                            {format(new Date(date), "dd MMM yyyy")}
                        </Typography>

                        <Stack spacing={3}>
                            {items.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card sx={{ p: 2 }}>
                                        {entry.photoUrls?.length > 0 && (
                                            <ImageList
                                                cols={entry.photoUrls.length > 1 ? 2 : 1}
                                                rowHeight={160}
                                                sx={{ mb: 2 }}
                                            >
                                                {entry.photoUrls.map((url: string, i: number) => (
                                                    <ImageListItem key={i}>
                                                        <img
                                                            src={url}
                                                            alt="journal"
                                                            style={{
                                                                borderRadius: 8,
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                    </ImageListItem>
                                                ))}
                                            </ImageList>
                                        )}

                                        <CardContent>
                                            <Typography variant="body1" sx={{ mb: 1 }}>
                                                {entry.summary}
                                            </Typography>

                                            <Typography
                                                variant="body2"
                                                sx={{ opacity: 0.7 }}
                                            >
                                                {entry.milestones}
                                            </Typography>

                                            <Button
                                                component={Link}
                                                href={`/parent/dashboard/${entry.id}`}
                                                variant="text"
                                                endIcon={<ArrowForwardIcon />}
                                                sx={{
                                                    mt: 2,
                                                    textTransform: "none",
                                                    fontWeight: 500,
                                                    color: "primary.main",
                                                    "&:hover": {
                                                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                                                    },
                                                }}
                                            >
                                                View Entry
                                            </Button>

                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </Stack>
                    </div>
                ))}
            </Stack>
        </Paper>
    );
}

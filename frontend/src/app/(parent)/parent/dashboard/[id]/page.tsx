"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {Paper, Typography, Stack, Card, CardContent, ImageList, ImageListItem, Button} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/src/context/AuthContext";

import { DailyJournalEntry } from "@/src/modules/teachers/model/dailyJournalEntry";
import { format } from "date-fns";
import {getParentJournalEntryById} from "@/src/modules/parent/api/getJournalEntry";
import Link from "next/link";

export default function ParentJournalEntryPage() {
    const { token } = useAuth();
    const { id } = useParams();
    const [entry, setEntry] = useState<DailyJournalEntry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token || !id) return;

        getParentJournalEntryById(token, Number(id))
            .then(setEntry)
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [token, id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;
    if (!entry) return <div>No entry found</div>;

    return (
        <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
            <Button
                component={Link}
                href="/parent/dashboard"
                variant="text"
                startIcon={<ArrowBackIcon />}
                sx={{
                    mb: 2,
                    textTransform: "none",
                    fontWeight: 500,
                    color: "primary.main",
                    "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                    },
                }}
            >
                Back to feed
            </Button>


            <Typography variant="h4" sx={{ mb: 3 }}>
                Journal Entry
            </Typography>

            <Typography variant="subtitle1" sx={{ opacity: 0.7, mb: 2 }}>
                {format(new Date(entry.date), "dd MMM yyyy")}
            </Typography>

            {entry.photoUrls?.length > 0 && (
                <ImageList cols={entry.photoUrls.length > 1 ? 2 : 1} rowHeight={200} sx={{ mb: 3 }}>
                    {entry.photoUrls.map((url, i) => (
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

            <Card sx={{ p: 2 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Summary
                    </Typography>
                    <Typography sx={{ mb: 2 }}>{entry.summary}</Typography>

                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Milestones
                    </Typography>
                    <Typography sx={{ opacity: 0.8 }}>{entry.milestones}</Typography>
                </CardContent>
            </Card>
        </Paper>
    );
}

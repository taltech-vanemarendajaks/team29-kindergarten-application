"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {Paper, Typography, Stack, Box, Button} from "@mui/material";
import { useAuth } from "@/src/context/AuthContext";
import {getDailyJournalEntry} from "@/src/modules/teachers/api/createDailyJournalEntry";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function JournalEntryPage() {

    const { id } = useParams();
    const { token } = useAuth();

    console.log("PARAMS:", useParams());
    console.log("ID RAW:", id);
    console.log("ID NUMBER:", Number(id));

    const [entry, setEntry] = useState<any>(null);

    useEffect(() => {
        if (!token) return;

        getDailyJournalEntry(token, Number(id)).then(setEntry);
    }, [token, id]);

    if (!entry) return <div>Loading...</div>;

    return (
        <Paper sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
            <Button
                component={Link}
                href="/teacher/journal/list"
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

            <Typography variant="h4" sx={{ mb: 2 }}>
                Daily Journal Entry
            </Typography>

            <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Date: {entry.date}
            </Typography>

            <Typography variant="h6">Summary</Typography>
            <Typography sx={{ mb: 3 }}>{entry.summary}</Typography>

            <Typography variant="h6">Milestones</Typography>
            <Typography sx={{ mb: 3 }}>{entry.milestones}</Typography>

            <Typography variant="h6" sx={{ mb: 1 }}>
                Photos
            </Typography>

            <Stack direction="row" spacing={2}>
                {entry.photoUrls.map((url: string, idx: number) => (
                    <img
                        key={idx}
                        src={url}
                        alt="photo"
                        style={{ width: 120, height: 120, borderRadius: 8 }}
                    />
                ))}
            </Stack>
        </Paper>
    );
}

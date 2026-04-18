"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";

import { Paper, Typography, Stack, Card, CardContent, CardMedia } from "@mui/material";
import {getParentJournalEntries} from "@/src/modules/parent/api/getJournalEntry";

export default function ParentJournalFeed() {
    const { token } = useAuth();
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        if (!token) return;
        getParentJournalEntries(token).then(setEntries);
    }, [token]);

    return (
        <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Daily Journal Feed
            </Typography>

            <Stack spacing={3}>
                {entries.map((entry: any) => (
                    <Card key={entry.id} sx={{ display: "flex", gap: 2, p: 2 }}>
                        {entry.photoUrls?.[0] && (
                            <CardMedia
                                component="img"
                                image={entry.photoUrls[0]}
                                alt="journal photo"
                                sx={{ width: 120, height: 120, borderRadius: 2 }}
                            />
                        )}

                        <CardContent>
                            <Typography variant="h6">{entry.date}</Typography>

                            <Typography sx={{ mt: 1 }}>
                                {entry.summary}
                            </Typography>

                            <Typography variant="body2" sx={{ mt: 1, opacity: 0.7 }}>
                                {entry.milestones}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        </Paper>
    );
}

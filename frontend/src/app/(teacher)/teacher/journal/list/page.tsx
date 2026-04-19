"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {Paper, Typography, Stack, Card, CardContent, CardMedia, Box, Button} from "@mui/material";
import { useAuth } from "@/src/context/AuthContext";
import {getTeacherJournalEntries} from "@/src/modules/teachers/api/createDailyJournalEntry";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";


export default function TeacherJournalListPage() {
    const { token } = useAuth();
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        getTeacherJournalEntries(token)
            .then((data) => {
                setEntries(data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, [token]);

    if (loading) return <div>Loading...</div>;

    return (
        <Paper sx={{ p: 3, maxWidth: 900, mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                All Journal Entries
            </Typography>

            <Stack spacing={3}>
                {entries.map((entry) => (
                    <Card
                        key={entry.id}
                        sx={{
                            display: "flex",
                            gap: 2,
                            p: 2,
                            alignItems: "center",
                        }}
                    >
                        {entry.photoUrls?.[0] && (
                            <CardMedia
                                component="img"
                                image={entry.photoUrls[0]}
                                alt="photo"
                                sx={{ width: 100, height: 100, borderRadius: 2 }}
                            />
                        )}

                        <CardContent sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">
                                {entry.date}
                            </Typography>

                            <Typography sx={{ mt: 1, opacity: 0.8 }}>
                                {entry.summary}
                            </Typography>

                            <Button
                                component={Link}
                                href={`/teacher/journal/${entry.id}`}
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
                ))}
            </Stack>
        </Paper>
    );
}

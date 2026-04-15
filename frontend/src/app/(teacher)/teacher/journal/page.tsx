"use client";

import { useState } from "react";
import { Paper, TextField, Button, Stack, Typography, Box } from "@mui/material";

import { useAuth } from "@/src/context/AuthContext";
import {createDailyJournalEntry} from "@/src/modules/teachers/api/createDailyJournalEntry";
import {DailyJournalEntry} from "@/src/modules/teachers/model/dailyJournalEntry";
import { useRouter } from "next/navigation";

export default function DailyJournalPage() {
    const { token } = useAuth();
    const router = useRouter();

    const [summary, setSummary] = useState("");
    const [milestones, setMilestones] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);

    // TODO: Implement photo upload
    const handleFakeUpload = () => {
        setPhotos((prev) => [...prev, "https://placekitten.com/300/300"]);
    };

    const handleSubmit = async () => {
        if (!token) {
            alert("No token found");
            return;
        }

        const entry: DailyJournalEntry = await createDailyJournalEntry(token, {
            summary,
            milestones,
            photoUrls: photos,
        });

        setSummary("");
        setMilestones("");
        setPhotos([]);

        // redirect to view page
        router.push(`/teacher/journal/${entry.id}`);
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Daily Journal
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Summary of the day"
                    multiline
                    minRows={4}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                />

                <TextField
                    label="Developmental milestones"
                    multiline
                    minRows={3}
                    value={milestones}
                    onChange={(e) => setMilestones(e.target.value)}
                />

                <Box>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>
                        Photos
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        {photos.map((url, idx) => (
                            <img
                                key={idx}
                                src={url}
                                alt="uploaded"
                                style={{ width: 80, height: 80, borderRadius: 8 }}
                            />
                        ))}
                    </Stack>

                    <Button variant="outlined" onClick={handleFakeUpload}>
                        Upload Photo
                    </Button>
                </Box>

                <Button variant="contained" onClick={handleSubmit}>
                    Publish
                </Button>
            </Stack>
        </Paper>
    );
}

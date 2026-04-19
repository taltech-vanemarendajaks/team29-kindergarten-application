"use client";

import { useState } from "react";
import { Paper, TextField, Button, Stack, Typography, Box } from "@mui/material";

import { useAuth } from "@/src/context/AuthContext";
import {createDailyJournalEntry} from "@/src/modules/teachers/api/createDailyJournalEntry";
import {DailyJournalEntry} from "@/src/modules/teachers/model/dailyJournalEntry";
import { useRouter } from "next/navigation";
import {uploadPhoto} from "@/src/modules/uploads/api/uploadPhoto";
import toast from "react-hot-toast";
import {API_URL} from "@/src/services/api";

export default function DailyJournalPage() {
    const { token } = useAuth();
    const router = useRouter();

    const [summary, setSummary] = useState("");
    const [milestones, setMilestones] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!token) return;

        // checking photos size (max 5mb)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File is too large (max 5MB)");
            return;
        }

        try {
            const url = await uploadPhoto(file, token);
            const fullUrl = `${API_URL}${url}`;
            setPhotos(prev => [...prev, fullUrl]);
            toast.success("Photo uploaded successfully");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        }
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
                            <Box key={idx} sx={{ position: "relative" }}>
                                <img
                                    src={url}
                                    alt="uploaded"
                                    style={{ width: 80, height: 80, borderRadius: 8 }}
                                />
                                <Button
                                    size="small"
                                    color="error"
                                    sx={{
                                        position: "absolute",
                                        top: -10,
                                        right: -10,
                                        minWidth: 0,
                                        width: 24,
                                        height: 24,
                                        borderRadius: "50%",
                                    }}
                                    onClick={() =>
                                        setPhotos((prev) => prev.filter((_, i) => i !== idx))
                                    }
                                >
                                </Button>
                            </Box>
                        ))}
                    </Stack>

                    <Button variant="outlined" component="label">
                        Upload Photo
                        <input type="file" hidden accept="image/*" onChange={handleUpload} />
                    </Button>
                </Box>

                <Button variant="contained" onClick={handleSubmit}>
                    Publish
                </Button>
            </Stack>
        </Paper>
    );
}

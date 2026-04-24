"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Paper,
    TextField,
    Button,
    Stack,
    Typography,
    Box
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";

import { useAuth } from "@/src/context/AuthContext";
import { getDailyJournalEntry, updateDailyJournalEntry } from "@/src/modules/teachers/api/callDailyJournalEntry";
import { uploadPhoto } from "@/src/modules/uploads/api/uploadPhoto";
import toast from "react-hot-toast";
import { API_URL } from "@/src/services/api";

export default function EditJournalEntryPage() {
    const { id } = useParams();
    const router = useRouter();
    const { token } = useAuth();

    const [summary, setSummary] = useState("");
    const [milestones, setMilestones] = useState("");
    const [photos, setPhotos] = useState<string[]>([]);
    const [date, setDate] = useState<Dayjs | null>(dayjs());
    const [loading, setLoading] = useState(true);

    // Load existing entry
    useEffect(() => {
        if (!token) return;

        getDailyJournalEntry(token, Number(id))
            .then((entry) => {
                setSummary(entry.summary);
                setMilestones(entry.milestones);
                setPhotos(entry.photoUrls || []);
                setDate(dayjs(entry.date));
                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load entry");
                setLoading(false);
            });
    }, [token, id]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !token) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File is too large (max 5MB)");
            return;
        }

        try {
            const url = await uploadPhoto(file, token);
            const fullUrl = `${API_URL}${url}`;
            setPhotos(prev => [...prev, fullUrl]);
            toast.success("Photo uploaded");
        } catch {
            toast.error("Upload failed");
        }
    };

    const handleSave = async () => {
        if (!token) return;

        try {
            await updateDailyJournalEntry(token, Number(id), {
                summary,
                milestones,
                photoUrls: photos,
                date: date ? date.format("YYYY-MM-DD") : "",
            });

            toast.success("Entry updated");
            router.push(`/teacher/journal/${id}`);
        } catch {
            toast.error("Failed to save changes");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <Paper sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
                Edit Journal Entry
            </Typography>

            <Stack spacing={2}>
                <DatePicker
                    label="Entry date"
                    value={date}
                    onChange={(newValue) => setDate(newValue)}
                />

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
                                        setPhotos(prev => prev.filter((_, i) => i !== idx))
                                    }
                                >
                                    ✕
                                </Button>
                            </Box>
                        ))}
                    </Stack>

                    <Button variant="outlined" component="label">
                        Upload Photo
                        <input type="file" hidden accept="image/*" onChange={handleUpload} />
                    </Button>
                </Box>

                <Button variant="contained" onClick={handleSave}>
                    Save Changes
                </Button>
            </Stack>
        </Paper>
    );
}

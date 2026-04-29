"use client";

import { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    Stack,
    Card,
    CardContent,
    Box,
    Button,
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { API_URL } from "@/src/services/api";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type JournalEntry = {
    id: number;
    date: string;
    summary: string;
    photoUrls: string[];
};

function CollapsibleCard({
                             title,
                             children,
                         }: {
    title: string;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(true);

    return (
        <Card
            sx={{
                p: 2,
                height: "100%",
                display: "flex",
                flexDirection: "column",
            }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: open ? 2 : 0,
                    cursor: "pointer",
                }}
                onClick={() => setOpen(!open)}>
                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography>

                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>

            {open && <Box sx={{ flex: 1 }}>{children}</Box>}
        </Card>
    );
}

function TeacherNotes() {
    const [notes, setNotes] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("teacher_notes");
        if (saved) setNotes(JSON.parse(saved));
    }, []);

    const saveNotes = (updated: string[]) => {
        setNotes(updated);
        localStorage.setItem("teacher_notes", JSON.stringify(updated));
    };

    const addNote = () => {
        if (!input.trim()) return;
        const updated = [...notes, input.trim()];
        saveNotes(updated);
        setInput("");
    };

    const deleteNote = (i: number) => {
        const updated = notes.filter((_, idx) => idx !== i);
        saveNotes(updated);
    };

    const startEditing = (i: number) => {
        setEditingIndex(i);
        setEditingValue(notes[i]);
    };

    const saveEdit = () => {
        if (editingIndex === null) return;
        const updated = [...notes];
        updated[editingIndex] = editingValue.trim();
        saveNotes(updated);
        setEditingIndex(null);
        setEditingValue("");
    };

    return (
        <Box>
            {/* Add new note */}
            <Stack direction="row" spacing={1} mb={2}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a note..."
                    style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                />
                <Button variant="contained" size="small" onClick={addNote}>
                    Add
                </Button>
            </Stack>

            {/* Notes list */}
            <Stack spacing={1}>
                {notes.map((note, i) => (
                    <Box
                        key={i}
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "rgba(0,0,0,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                        }}>
                        {editingIndex === i ? (
                            <input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid #bbb",
                                }}
                            />
                        ) : (
                            <Typography sx={{ flex: 1 }}>{note}</Typography>
                        )}

                        {editingIndex === i ? (
                            <Button size="small" onClick={saveEdit}>
                                Save
                            </Button>
                        ) : (
                            <Button size="small" onClick={() => startEditing(i)}>
                                Edit
                            </Button>
                        )}

                        <Button size="small" color="error" onClick={() => deleteNote(i)}>
                            Delete
                        </Button>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}

function UpcomingEvents() {
    const [events, setEvents] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("teacher_events");
        if (saved) setEvents(JSON.parse(saved));
    }, []);

    const saveEvents = (updated: string[]) => {
        setEvents(updated);
        localStorage.setItem("teacher_events", JSON.stringify(updated));
    };

    const addEvent = () => {
        if (!input.trim()) return;
        const updated = [...events, input.trim()];
        saveEvents(updated);
        setInput("");
    };

    const deleteEvent = (i: number) => {
        const updated = events.filter((_, idx) => idx !== i);
        saveEvents(updated);
    };

    const startEditing = (i: number) => {
        setEditingIndex(i);
        setEditingValue(events[i]);
    };

    const saveEdit = () => {
        if (editingIndex === null) return;
        const updated = [...events];
        updated[editingIndex] = editingValue.trim();
        saveEvents(updated);
        setEditingIndex(null);
        setEditingValue("");
    };

    return (
        <Box>
            {/* Add new event */}
            <Stack direction="row" spacing={1} mb={2}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add event..."
                    style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                />
                <Button variant="contained" size="small" onClick={addEvent}>
                    Add
                </Button>
            </Stack>

            {/* Events list */}
            <Stack spacing={1}>
                {events.map((ev, i) => (
                    <Box
                        key={i}
                        sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "rgba(0,0,0,0.04)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                        }}
                    >
                        {editingIndex === i ? (
                            <input
                                value={editingValue}
                                onChange={(e) => setEditingValue(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    border: "1px solid #bbb",
                                }}
                            />
                        ) : (
                            <Typography sx={{ flex: 1 }}>{ev}</Typography>
                        )}

                        {editingIndex === i ? (
                            <Button size="small" onClick={saveEdit}>
                                Save
                            </Button>
                        ) : (
                            <Button size="small" onClick={() => startEditing(i)}>
                                Edit
                            </Button>
                        )}

                        <Button size="small" color="error" onClick={() => deleteEvent(i)}>
                            Delete
                        </Button>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}

function RecentPhotos({ entries }: { entries: JournalEntry[] }) {
    const photos = entries.flatMap((e) => e.photoUrls).slice(0, 6);

    if (photos.length === 0) return null;

    return (
        <Card sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={600} mb={2}>
                Recent Photos
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap">
                {photos.map((url, i) => (
                    <Box
                        key={i}
                        sx={{
                            width: 70,
                            height: 70,
                            borderRadius: 1,
                            backgroundImage: `url(${url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    />
                ))}
            </Stack>
        </Card>
    );
}

export default function TeacherDashboard() {
    const { token } = useAuth();

    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [childrenCount, setChildrenCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            fetch(`${API_URL}/api/teacher/journal`, { headers }),
            fetch(`${API_URL}/api/v1/children/class-records`, { headers }),
        ])
            .then(async ([journalRes, childrenRes]) => {

                // save parse journal
                const journalText = await journalRes.text();
                const journalData = journalText ? JSON.parse(journalText) : [];

                // save parse children
                const childrenText = await childrenRes.text();
                const childrenData = childrenText ? JSON.parse(childrenText) : [];

                setEntries(journalData ?? []);
                setChildrenCount(childrenData?.length ?? 0);
            })
            .finally(() => setLoading(false));
    }, [token]);


    const recent = entries.slice(0, 3);

    return (
        <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Stack spacing={4}>

                {/* Header */}
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Teacher Dashboard
                    </Typography>
                    <Typography color="text.secondary">
                        Welcome! Choose an action to get started.
                    </Typography>
                </Box>

                {/* Workspace Title */}
                <Typography variant="h5" fontWeight={700}>
                    Your workspace
                </Typography>

                {/* Notes + Events in two columns */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        width: "100%",
                    }}
                >
                    {/* Left column */}
                    <Box sx={{ flex: 1 }}>
                        <CollapsibleCard title="Notes for Teacher">
                            <TeacherNotes />
                        </CollapsibleCard>
                    </Box>

                    {/* Vertical divider */}
                    <Box
                        sx={{
                            width: "1px",
                            bgcolor: "rgba(0,0,0,0.12)",
                            display: { xs: "none", md: "block" },
                        }}
                    />

                    {/* Right column */}
                    <Box sx={{ flex: 1 }}>
                        <CollapsibleCard title="Upcoming Events">
                            <UpcomingEvents />
                        </CollapsibleCard>
                    </Box>
                </Box>

                {/* Recent Photos */}
                <RecentPhotos entries={entries} />

                {/* Recent Entries */}
                <Box>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                        Recent Journal Entries
                    </Typography>

                    {loading && <Typography color="text.secondary">Loading...</Typography>}

                    {!loading && recent.length === 0 && (
                        <Typography color="text.secondary">No entries yet.</Typography>
                    )}

                    {!loading && recent.length > 0 && (
                        <Stack spacing={2}>
                            {recent.map((entry) => (
                                <Card key={entry.id} sx={{ borderRadius: 2 }}>
                                    <CardContent>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {entry.date}
                                        </Typography>

                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                            sx={{ mt: 1, mb: 1 }}>
                                            {entry.summary.length > 60
                                                ? entry.summary.slice(0, 60) + "..."
                                                : entry.summary}
                                        </Typography>

                                        <Typography color="text.secondary" variant="body2" mb={2}>
                                            📸 {entry.photoUrls?.length ?? 0} photos
                                        </Typography>

                                        <Link href={`/teacher/journal/${entry.id}`} passHref>
                                            <Button variant="outlined" size="small">
                                                View Entry
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </Box>
            </Stack>
        </Paper>
    );
}

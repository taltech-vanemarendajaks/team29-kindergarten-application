"use client";

import { useEffect, useState } from "react";
import {
    Paper,
    Typography,
    Stack,
    Card,
    Box,
    Button,
    CircularProgress,
    IconButton
} from "@mui/material";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { API_URL } from "@/src/services/api";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {getUserOptionsByRole} from "@/src/modules/users";
import {Add} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

type JournalEntry = {
    id: number;
    date: string;
    summary: string;
    milestones: string;
    photoUrls: string[];
};

function CollapsibleCard({ title, children }: { title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(true);

    return (
        <Card sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: open ? 2 : 0,
                    cursor: "pointer",
                }}
                onClick={() => setOpen(!open)}
            >
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
    const [notes, setNotes] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem("teacher_notes");
        return saved ? JSON.parse(saved) : [];
    });

    const [newNote, setNewNote] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");

    const saveNotes = (updated: string[]) => {
        setNotes(updated);
        localStorage.setItem("teacher_notes", JSON.stringify(updated));
    };

    const addNote = () => {
        if (!newNote.trim()) return;
        saveNotes([...notes, newNote.trim()]);
        setNewNote("");
    };

    const startEditing = (i: number) => {
        setEditingIndex(i);
        setEditingValue(notes[i]);
    };

    const finishEditing = () => {
        if (editingIndex === null) return;
        const updated = [...notes];
        updated[editingIndex] = editingValue.trim();
        saveNotes(updated);
        setEditingIndex(null);
        setEditingValue("");
    };

    const deleteNote = (i: number) => {
        saveNotes(notes.filter((_, idx) => idx !== i));
    };

    return (
        <Stack spacing={1.5}>
            {/* Add new note */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                    style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                />
                <IconButton onClick={addNote} size="small">
                    <Add fontSize="small" />
                </IconButton>
            </Box>

            {/* Notes list */}
            {notes.map((note, i) => (
                <Box
                    key={i}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1,
                        borderRadius: 1,
                        bgcolor: "rgba(0,0,0,0.03)",
                        "&:hover .note-actions": { opacity: 1 },
                    }}
                >
                    {editingIndex === i ? (
                        <input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={finishEditing}
                            onKeyDown={(e) => e.key === "Enter" && finishEditing()}
                            autoFocus
                            style={{
                                flex: 1,
                                padding: "4px 8px",
                                borderRadius: "6px",
                                border: "1px solid #bbb",
                            }}
                        />
                    ) : (
                        <Typography
                            sx={{ flex: 1, cursor: "pointer" }}
                            onClick={() => startEditing(i)}
                        >
                            {note}
                        </Typography>
                    )}

                    {/* Hover actions */}
                    <Stack
                        direction="row"
                        spacing={0.5}
                        className="note-actions"
                        sx={{ opacity: 0, transition: "opacity 0.2s" }}
                    >
                        <IconButton size="small" onClick={() => startEditing(i)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => deleteNote(i)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
}

function UpcomingEvents() {
    const [events, setEvents] = useState<string[]>(() => {
        if (typeof window === "undefined") return [];
        const saved = localStorage.getItem("teacher_events");
        return saved ? JSON.parse(saved) : [];
    });

    const [newEvent, setNewEvent] = useState("");
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingValue, setEditingValue] = useState("");

    const saveEvents = (updated: string[]) => {
        setEvents(updated);
        localStorage.setItem("teacher_events", JSON.stringify(updated));
    };

    const addEvent = () => {
        if (!newEvent.trim()) return;
        saveEvents([...events, newEvent.trim()]);
        setNewEvent("");
    };

    const startEditing = (i: number) => {
        setEditingIndex(i);
        setEditingValue(events[i]);
    };

    const finishEditing = () => {
        if (editingIndex === null) return;
        const updated = [...events];
        updated[editingIndex] = editingValue.trim();
        saveEvents(updated);
        setEditingIndex(null);
        setEditingValue("");
    };

    const deleteEvent = (i: number) => {
        saveEvents(events.filter((_, idx) => idx !== i));
    };

    return (
        <Stack spacing={1.5}>
            {/* Add new event */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <input
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    placeholder="Add event..."
                    onKeyDown={(e) => e.key === "Enter" && addEvent()}
                    style={{
                        flex: 1,
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                    }}
                />
                <IconButton onClick={addEvent} size="small">
                    <Add fontSize="small" />
                </IconButton>
            </Box>

            {/* Events list */}
            {events.map((ev, i) => (
                <Box
                    key={i}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        p: 1,
                        borderRadius: 1,
                        bgcolor: "rgba(0,0,0,0.03)",
                        "&:hover .event-actions": { opacity: 1 },
                    }}
                >
                    {editingIndex === i ? (
                        <input
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onBlur={finishEditing}
                            onKeyDown={(e) => e.key === "Enter" && finishEditing()}
                            autoFocus
                            style={{
                                flex: 1,
                                padding: "4px 8px",
                                borderRadius: "6px",
                                border: "1px solid #bbb",
                            }}
                        />
                    ) : (
                        <Typography
                            sx={{ flex: 1, cursor: "pointer" }}
                            onClick={() => startEditing(i)}
                        >
                            {ev}
                        </Typography>
                    )}

                    {/* Hover actions */}
                    <Stack
                        direction="row"
                        spacing={0.5}
                        className="event-actions"
                        sx={{ opacity: 0, transition: "opacity 0.2s" }}
                    >
                        <IconButton size="small" onClick={() => startEditing(i)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => deleteEvent(i)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Stack>
                </Box>
            ))}
        </Stack>
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

function TeacherDailyJournalFeed({
                                     entries,
                                     loading,
                                     error,
                                 }: {
    entries: JournalEntry[];
    loading: boolean;
    error: string | null;
}) {
    const getTimelineLabel = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    return (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Daily Journal Feed</Typography>

                    <Button
                        component={Link}
                        href="/teacher/journal/list"
                        variant="outlined"
                        size="small"
                        endIcon={<VisibilityOutlinedIcon fontSize="small" />}
                        sx={{ textTransform: "none", fontWeight: 500, fontSize: "0.875rem" }}
                    >
                        View All
                    </Button>
                </Stack>

                {loading && (
                    <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={18} />
                        <Typography color="text.secondary">Loading timeline...</Typography>
                    </Stack>
                )}

                {error && <Typography color="error.main">{error}</Typography>}

                {!loading && !error && entries.length === 0 && (
                    <Typography color="text.secondary">
                        No journal entries yet. New updates will appear here.
                    </Typography>
                )}

                {!loading && !error && entries.length > 0 && (
                    <Stack spacing={0}>
                        {entries.map((entry, index) => (
                            <Box key={entry.id} sx={{ display: "flex", gap: 1.5, py: 2 }}>
                                <Stack alignItems="center" sx={{ minWidth: 28 }}>
                                    <CheckCircleIcon color="primary" fontSize="small" />
                                    {index < entries.length - 1 && (
                                        <Box
                                            sx={{
                                                width: 2,
                                                flex: 1,
                                                bgcolor: "primary.main",
                                                opacity: 0.45,
                                                mt: 0.75,
                                                minHeight: 24,
                                            }}
                                        />
                                    )}
                                </Stack>

                                <Stack spacing={0.5} sx={{ flex: 1 }}>
                                    <Typography fontWeight={600}>{entry.summary}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {entry.milestones}
                                    </Typography>
                                </Stack>

                                <Stack alignItems="flex-end" spacing={0.75}>
                                    <Typography
                                        variant="caption"
                                        color="text.secondary"
                                        sx={{ whiteSpace: "nowrap" }}
                                    >
                                        {getTimelineLabel(entry.date)}
                                    </Typography>

                                    <Button
                                        component={Link}
                                        href={`/teacher/journal/${entry.id}`}
                                        variant="outlined"
                                        size="small"
                                        sx={{ minWidth: "auto", px: 1, minHeight: 28 }}
                                        aria-label="Open journal entry"
                                    >
                                        <VisibilityOutlinedIcon fontSize="small" />
                                    </Button>
                                </Stack>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Stack>
        </Paper>
    );
}

export default function TeacherDashboard() {
    const { token, userId } = useAuth();

    const [teacherName, setTeacherName] = useState("Teacher");
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [childrenCount, setChildrenCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    /* Load teacher name */
    useEffect(() => {
        if (!token || !userId) return;

        let isMounted = true;

        const loadTeacherName = async () => {
            try {
                const teachers = await getUserOptionsByRole(token, "TEACHER");
                if (!isMounted) return;

                const currentTeacher = teachers.find((t) => t.id === userId);
                const resolvedName = currentTeacher?.fullName?.trim();

                setTeacherName(resolvedName && resolvedName.length > 0 ? resolvedName : "Teacher");
            } catch {
                // we are doing nothing with the error here since we have a fallback name
            }
        };

        void loadTeacherName();

        return () => {
            isMounted = false;
        };
    }, [token, userId]);

    /* Load journal + children */
    useEffect(() => {
        if (!token) return;

        const headers = { Authorization: `Bearer ${token}` };

        Promise.all([
            fetch(`${API_URL}/api/teacher/journal`, { headers }),
            fetch(`${API_URL}/api/teacher/group/children`, { headers }),
        ])
            .then(async ([journalRes, childrenRes]) => {
                const journalText = await journalRes.text();
                const journalData = journalText ? JSON.parse(journalText) : [];

                const childrenText = await childrenRes.text();
                const childrenData = childrenText ? JSON.parse(childrenText) : [];

                setEntries(journalData ?? []);
                setChildrenCount(childrenData?.length ?? 0);
            })
            .finally(() => setLoading(false));
    }, [token]);

    return (
        <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Stack spacing={4}>

                {/* Header */}
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Welcome, {teacherName}
                    </Typography>
                    <Typography color="text.secondary">
                        Here is your workspace for today.
                    </Typography>
                </Box>

                {/* Workspace Title */}
                <Typography variant="h5" fontWeight={700}>
                    Your workspace
                </Typography>

                {/* Notes + Events */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 2,
                        width: "100%",
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <CollapsibleCard title="Notes for Teacher">
                            <TeacherNotes />
                        </CollapsibleCard>
                    </Box>

                    <Box
                        sx={{
                            width: "1px",
                            bgcolor: "rgba(0,0,0,0.12)",
                            display: { xs: "none", md: "block" },
                        }}
                    />

                    <Box sx={{ flex: 1 }}>
                        <CollapsibleCard title="Upcoming Events">
                            <UpcomingEvents />
                        </CollapsibleCard>
                    </Box>
                </Box>

                {/* Recent Photos */}
                <RecentPhotos entries={entries} />

                {/* Daily Journal Feed */}
                <TeacherDailyJournalFeed
                    entries={entries}
                    loading={loading}
                    error={null}
                />
            </Stack>
        </Paper>
    );
}

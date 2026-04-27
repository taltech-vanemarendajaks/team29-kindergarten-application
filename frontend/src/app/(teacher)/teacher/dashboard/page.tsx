"use client";

import {
    Paper,
    Typography,
    Stack,
    Box,
    Button,
} from "@mui/material";
import Link from "next/link";

import CreateIcon from "@mui/icons-material/Create";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ChecklistIcon from "@mui/icons-material/Checklist";
import GroupsIcon from "@mui/icons-material/Groups";

export default function TeacherDashboard() {
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

                {/* Quick Actions — ghost buttons aligned left */}
                <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Stack spacing={1.2} sx={{ width: "220px" }}>
                        <Link href="/teacher/journal" passHref>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<CreateIcon fontSize="small" />}
                                sx={{
                                    justifyContent: "flex-start",
                                    textTransform: "none",
                                    fontSize: "0.85rem",
                                    color: "text.primary",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.04)",
                                    },
                                }}>
                                New Journal Entry
                            </Button>
                        </Link>

                        <Link href="/teacher/journal/list" passHref>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<ListAltIcon fontSize="small" />}
                                sx={{
                                    justifyContent: "flex-start",
                                    textTransform: "none",
                                    fontSize: "0.85rem",
                                    color: "text.primary",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.04)",
                                    },
                                }}>
                                View All Entries
                            </Button>
                        </Link>

                        <Link href="/teacher/attendance" passHref>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<ChecklistIcon fontSize="small" />}
                                sx={{
                                    justifyContent: "flex-start",
                                    textTransform: "none",
                                    fontSize: "0.85rem",
                                    color: "text.primary",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.04)",
                                    },
                                }}>
                                Attendance
                            </Button>
                        </Link>

                        <Link href="/teacher/class-records" passHref>
                            <Button
                                variant="text"
                                size="small"
                                startIcon={<GroupsIcon fontSize="small" />}
                                sx={{
                                    justifyContent: "flex-start",
                                    textTransform: "none",
                                    fontSize: "0.85rem",
                                    color: "text.primary",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    "&:hover": {
                                        backgroundColor: "rgba(0,0,0,0.04)",
                                    },
                                }}>
                                Class Records
                            </Button>
                        </Link>
                    </Stack>
                </Box>
            </Stack>
        </Paper>
    );
}

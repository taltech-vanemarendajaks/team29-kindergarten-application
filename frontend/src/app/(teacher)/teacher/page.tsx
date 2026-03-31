"use client";

import { Typography, Paper } from "@mui/material";

export default function TeacherDashboardPage() {
    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700}>
                Teacher Dashboard
            </Typography>

            <Typography sx={{ mt: 2 }}>
                Welcome! Here you can manage your groups, attendance and messages.
            </Typography>
        </Paper>
    );
}
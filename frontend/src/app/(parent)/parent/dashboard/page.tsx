"use client";

import { Typography, Paper } from "@mui/material";

export default function ParentDashboardPage() {
    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700}>
                Parent Dashboard
            </Typography>

            <Typography sx={{ mt: 2 }}>
                Welcome! Here you can manage your child’s activities.
            </Typography>
        </Paper>
    );
}
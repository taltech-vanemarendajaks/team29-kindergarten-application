"use client";

import { Paper, Typography } from "@mui/material";

export default function KindergartenAdminDashboardPage() {
    return (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h4" fontWeight={700}>
                Kindergarten Admin Dashboard
            </Typography>

            <Typography sx={{ mt: 2 }}>
                Welcome! Manage teachers, parents, groups, attendance and system settings.
            </Typography>
        </Paper>
    );
}
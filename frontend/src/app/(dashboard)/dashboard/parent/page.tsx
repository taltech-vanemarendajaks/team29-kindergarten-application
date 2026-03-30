"use client";

import { Protected } from "@/src/components/Protected";
import { Typography } from "@mui/material";

export default function ParentDashboardPage() {
    return (
        <Protected>
            <Typography variant="h4">Parent dashboard</Typography>
        </Protected>
    );
}
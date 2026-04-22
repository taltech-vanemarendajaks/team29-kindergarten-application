import type { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { AttendanceSummary } from "@/src/modules/attendance";

type StatTone = "success" | "error" | "warning" | "primary";

const TrendingUpIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
            d="M3 17l6-6 4 4 8-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path d="M14 7h7v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CheckCircleIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path
            d="M8.5 12.5l2.4 2.4 4.6-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CrossCircleIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const HospitalCrossIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

interface AttendanceStatsProps {
    summary: AttendanceSummary;
}

interface StatCardProps {
    title: string;
    value: string;
    subtitle?: string;
    icon: ReactNode;
    tone: StatTone;
}

function StatCard({ title, value, subtitle, icon, tone }: StatCardProps) {
    return (
        <Paper
            variant="outlined"
            sx={(theme) => ({
                p: 2,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1.5,
                borderColor: alpha(theme.palette.text.primary, 0.08),
            })}
        >
            <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                <Typography variant="body2" color="text.secondary" noWrap>
                    {title}
                </Typography>
                <Typography variant="h5" fontWeight={700} noWrap>
                    {value}
                </Typography>
                {subtitle ? (
                    <Typography variant="caption" color="text.secondary">
                        {subtitle}
                    </Typography>
                ) : null}
            </Stack>
            <Box
                sx={(theme) => {
                    const accent = theme.palette[tone].main;
                    return {
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: alpha(accent, 0.14),
                        color: accent,
                        flexShrink: 0,
                    };
                }}
            >
                {icon}
            </Box>
        </Paper>
    );
}

export default function AttendanceStats({ summary }: AttendanceStatsProps) {
    return (
        <Stack spacing={1.5}>
            <StatCard
                title="Presence Rate"
                value={`${summary.presenceRate}%`}
                tone="success"
                icon={TrendingUpIcon}
            />
            <StatCard
                title="Present Days"
                value={`${summary.presentDays}/${summary.totalDaysInMonth}`}
                subtitle={`${summary.trackedDays} tracked day(s)`}
                tone="primary"
                icon={CheckCircleIcon}
            />
            <StatCard
                title="Absent Days"
                value={String(summary.absentDays)}
                tone="error"
                icon={CrossCircleIcon}
            />
            <StatCard
                title="Sick Days"
                value={String(summary.sickDays)}
                tone="warning"
                icon={HospitalCrossIcon}
            />
        </Stack>
    );
}

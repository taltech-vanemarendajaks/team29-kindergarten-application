import type { ReactNode } from "react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { AttendanceRecord, AttendanceStatus } from "@/src/modules/attendance";

interface RecentRecordsProps {
    records: AttendanceRecord[];
}

type StatusTone = "success" | "error" | "warning";

const CheckIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            fill="currentColor"
        />
        <path
            d="M8.5 12.5l2.4 2.4 4.6-5"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const CrossIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            fill="currentColor"
        />
        <path
            d="M9 9l6 6M15 9l-6 6"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const HospitalIcon = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
            d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
            fill="currentColor"
        />
        <path
            d="M12 7v10M7 12h10"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
        />
    </svg>
);

const statusMeta: Record<
    AttendanceStatus,
    { label: string; badge: string; tone: StatusTone; icon: ReactNode }
> = {
    PRESENT: { label: "Present", badge: "Attended", tone: "success", icon: CheckIcon },
    ABSENT: { label: "Absent", badge: "Excused", tone: "error", icon: CrossIcon },
    SICK: { label: "Sick Leave", badge: "Sick Day", tone: "warning", icon: HospitalIcon },
};

function formatRecordDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}

export default function RecentRecords({ records }: RecentRecordsProps) {
    const recent = [...records]
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 5);

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Recent Records
            </Typography>
            {recent.length === 0 ? (
                <Typography color="text.secondary">No attendance records for the selected month.</Typography>
            ) : (
                <Stack spacing={1.25}>
                    {recent.map((record) => {
                        const meta = statusMeta[record.status];
                        return (
                            <Paper
                                key={record.id}
                                variant="outlined"
                                sx={(theme) => {
                                    const accent = theme.palette[meta.tone].main;
                                    return {
                                        px: 2,
                                        py: 1.25,
                                        borderRadius: 3,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: 1.5,
                                        borderColor: alpha(theme.palette.text.primary, 0.08),
                                        transition: "background-color 120ms ease, box-shadow 120ms ease",
                                        "&:hover": {
                                            bgcolor: alpha(accent, 0.04),
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.04)}`,
                                        },
                                    };
                                }}
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                                    <Box
                                        sx={(theme) => {
                                            const accent = theme.palette[meta.tone].main;
                                            return {
                                                width: 40,
                                                height: 40,
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
                                        {meta.icon}
                                    </Box>
                                    <Stack sx={{ minWidth: 0 }}>
                                        <Typography fontWeight={600} noWrap>
                                            {meta.label}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" noWrap>
                                            {formatRecordDate(record.date)}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Box
                                    sx={(theme) => {
                                        const accent = theme.palette[meta.tone].main;
                                        const darker = theme.palette[meta.tone].dark;
                                        return {
                                            px: 1.25,
                                            py: 0.25,
                                            borderRadius: 999,
                                            bgcolor: alpha(accent, 0.14),
                                            color: darker,
                                            fontSize: 12,
                                            fontWeight: 600,
                                            letterSpacing: 0.2,
                                            whiteSpace: "nowrap",
                                            flexShrink: 0,
                                        };
                                    }}
                                >
                                    {meta.badge}
                                </Box>
                            </Paper>
                        );
                    })}
                </Stack>
            )}
        </Paper>
    );
}

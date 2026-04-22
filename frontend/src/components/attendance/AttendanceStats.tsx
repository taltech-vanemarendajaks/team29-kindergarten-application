import { Paper, Stack, Typography } from "@mui/material";
import type { AttendanceSummary } from "@/src/modules/attendance";

interface AttendanceStatsProps {
    summary: AttendanceSummary;
}

function StatCard({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="body2" color="text.secondary">
                {title}
            </Typography>
            <Typography variant="h5" fontWeight={700}>
                {value}
            </Typography>
            {subtitle ? (
                <Typography variant="caption" color="text.secondary">
                    {subtitle}
                </Typography>
            ) : null}
        </Paper>
    );
}

export default function AttendanceStats({ summary }: AttendanceStatsProps) {
    return (
        <Stack spacing={1.5}>
            <StatCard title="Presence Rate" value={`${summary.presenceRate}%`} />
            <StatCard
                title="Present Days"
                value={`${summary.presentDays}/${summary.totalDaysInMonth}`}
                subtitle={`${summary.trackedDays} tracked day(s)`}
            />
            <StatCard title="Absent Days" value={String(summary.absentDays)} />
            <StatCard title="Sick Days" value={String(summary.sickDays)} />
        </Stack>
    );
}

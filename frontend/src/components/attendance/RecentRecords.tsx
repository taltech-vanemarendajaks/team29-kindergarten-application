import { Chip, Paper, Stack, Typography } from "@mui/material";
import type { AttendanceRecord, AttendanceStatus } from "@/src/modules/attendance";

interface RecentRecordsProps {
    records: AttendanceRecord[];
}

const statusMeta: Record<
    AttendanceStatus,
    { label: string; color: "success" | "error" | "warning"; icon: string }
> = {
    PRESENT: { label: "Present", color: "success", icon: "P" },
    ABSENT: { label: "Absent", color: "error", icon: "A" },
    SICK: { label: "Sick", color: "warning", icon: "S" },
};

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
                                sx={{ p: 1.5, borderRadius: 3, display: "flex", justifyContent: "space-between" }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: "50%",
                                            border: 1,
                                            borderColor: "divider",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                        }}
                                    >
                                        {meta.icon}
                                    </Typography>
                                    <Stack>
                                        <Typography fontWeight={600}>{meta.label}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(record.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </Typography>
                                    </Stack>
                                </Stack>
                                <Chip label={meta.label} color={meta.color} size="small" variant="outlined" />
                            </Paper>
                        );
                    })}
                </Stack>
            )}
        </Paper>
    );
}

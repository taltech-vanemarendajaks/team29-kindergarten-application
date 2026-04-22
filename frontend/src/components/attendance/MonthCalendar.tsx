import { Box, Paper, Stack, Typography } from "@mui/material";
import type { AttendanceRecord, AttendanceStatus } from "@/src/modules/attendance";

interface MonthCalendarProps {
    monthStart: Date;
    records: AttendanceRecord[];
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
}

const weekDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

const statusStyles: Record<AttendanceStatus, { bg: string; dot: string }> = {
    PRESENT: { bg: "success.light", dot: "success.main" },
    ABSENT: { bg: "error.light", dot: "error.main" },
    SICK: { bg: "warning.light", dot: "warning.main" },
};

function toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getGridOffsetFromMonday(jsDay: number): number {
    return jsDay === 0 ? 6 : jsDay - 1;
}

export default function MonthCalendar({ monthStart, records, selectedDate, onSelectDate }: MonthCalendarProps) {
    const daysInMonth = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0).getDate();
    const startOffset = getGridOffsetFromMonday(monthStart.getDay());

    const recordsByDate = new Map(records.map((record) => [record.date, record]));

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                Monthly Schedule
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(7, minmax(42px, 1fr))",
                    gap: 1,
                }}
            >
                {weekDays.map((weekDay) => (
                    <Typography key={weekDay} variant="caption" color="text.secondary" sx={{ textAlign: "center" }}>
                        {weekDay}
                    </Typography>
                ))}

                {Array.from({ length: startOffset }).map((_, index) => (
                    <Box key={`offset-${index}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                    const day = index + 1;
                    const date = new Date(monthStart.getFullYear(), monthStart.getMonth(), day);
                    const iso = toIsoDate(date);
                    const record = recordsByDate.get(iso);
                    const statusStyle = record ? statusStyles[record.status] : undefined;
                    const isSelected = selectedDate === iso;
                    const isToday = toIsoDate(new Date()) === iso;

                    return (
                        <Paper
                            key={iso}
                            role="button"
                            tabIndex={0}
                            onClick={() => onSelectDate(iso)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    onSelectDate(iso);
                                }
                            }}
                            sx={{
                                py: 1,
                                borderRadius: 2.5,
                                textAlign: "center",
                                cursor: "pointer",
                                borderWidth: isSelected || isToday ? 2 : 1,
                                borderStyle: "solid",
                                borderColor: isSelected ? "primary.main" : isToday ? "primary.light" : "divider",
                                bgcolor: statusStyle?.bg ?? "background.paper",
                                userSelect: "none",
                            }}
                        >
                            <Stack spacing={0.3} alignItems="center">
                                <Typography variant="body2" fontWeight={600}>
                                    {day}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        bgcolor: statusStyle?.dot ?? "transparent",
                                    }}
                                />
                            </Stack>
                        </Paper>
                    );
                })}
            </Box>
        </Paper>
    );
}

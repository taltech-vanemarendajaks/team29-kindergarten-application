import { Box, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { AttendanceRecord, AttendanceStatus } from "@/src/modules/attendance";

interface MonthCalendarProps {
    monthStart: Date;
    records: AttendanceRecord[];
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
}

const weekDays = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];

type StatusTone = "success" | "error" | "warning";

const statusTone: Record<AttendanceStatus, StatusTone> = {
    PRESENT: "success",
    ABSENT: "error",
    SICK: "warning",
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
                    <Typography
                        key={weekDay}
                        variant="caption"
                        color="text.secondary"
                        sx={{ textAlign: "center", letterSpacing: 0.5, fontWeight: 600 }}
                    >
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
                    const tone = record ? statusTone[record.status] : null;
                    const isSelected = selectedDate === iso;
                    const isToday = toIsoDate(new Date()) === iso;

                    return (
                        <Paper
                            key={iso}
                            role="button"
                            tabIndex={0}
                            elevation={0}
                            onClick={() => onSelectDate(iso)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    onSelectDate(iso);
                                }
                            }}
                            sx={(theme) => {
                                const accent = tone ? theme.palette[tone].main : null;
                                const accentDark = tone ? theme.palette[tone].dark : null;
                                return {
                                    py: 1,
                                    borderRadius: 2.5,
                                    textAlign: "center",
                                    cursor: "pointer",
                                    transition: "transform 120ms ease, box-shadow 120ms ease, background-color 120ms ease",
                                    borderWidth: isSelected ? 2 : 1,
                                    borderStyle: "solid",
                                    borderColor: isSelected
                                        ? "primary.main"
                                        : isToday
                                        ? "primary.light"
                                        : accent
                                        ? alpha(accent, 0.25)
                                        : alpha(theme.palette.text.primary, 0.08),
                                    bgcolor: accent ? alpha(accent, 0.16) : "background.paper",
                                    color: accentDark ?? "text.primary",
                                    userSelect: "none",
                                    "&:hover": {
                                        bgcolor: accent
                                            ? alpha(accent, 0.24)
                                            : alpha(theme.palette.primary.main, 0.06),
                                        transform: "translateY(-1px)",
                                        boxShadow: accent
                                            ? `0 4px 10px ${alpha(accent, 0.2)}`
                                            : `0 4px 10px ${alpha(theme.palette.common.black, 0.06)}`,
                                    },
                                    "&:focus-visible": {
                                        outline: "none",
                                        boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.35)}`,
                                    },
                                };
                            }}
                        >
                            <Stack spacing={0.3} alignItems="center">
                                <Typography variant="body2" fontWeight={700}>
                                    {day}
                                </Typography>
                                <Box
                                    sx={(theme) => ({
                                        width: 5,
                                        height: 5,
                                        borderRadius: "50%",
                                        bgcolor: tone ? theme.palette[tone].dark : "transparent",
                                        opacity: tone ? 0.75 : 0,
                                    })}
                                />
                            </Stack>
                        </Paper>
                    );
                })}
            </Box>
        </Paper>
    );
}

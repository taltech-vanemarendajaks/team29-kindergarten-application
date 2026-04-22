"use client";

import { useAuth } from "@/src/context/AuthContext";
import { getChildAttendance, summarizeAttendance, type AttendanceRecord } from "@/src/modules/attendance";
import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import AttendanceStats from "./AttendanceStats";
import MonthCalendar from "./MonthCalendar";
import MonthSwitcher from "./MonthSwitcher";
import RecentRecords from "./RecentRecords";

interface AttendanceTabProps {
    childId: number;
}

function monthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameMonth(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export default function AttendanceTab({ childId }: AttendanceTabProps) {
    const { token } = useAuth();
    const [month, setMonth] = useState(() => monthStart(new Date()));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const monthFrom = useMemo(() => monthStart(month), [month]);
    const monthTo = useMemo(() => new Date(month.getFullYear(), month.getMonth() + 1, 0), [month]);

    useEffect(() => {
        if (!token) {
            setRecords([]);
            setLoadError("Please sign in to load attendance.");
            return;
        }

        let isCancelled = false;
        const loadAttendance = async () => {
            try {
                setIsLoading(true);
                setLoadError(null);
                const result = await getChildAttendance(token, {
                    childId,
                    from: toIsoDate(monthFrom),
                    to: toIsoDate(monthTo),
                });
                if (!isCancelled) {
                    setRecords(result);
                }
            } catch {
                if (!isCancelled) {
                    setRecords([]);
                    setLoadError("Failed to load attendance for the selected month.");
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        };

        void loadAttendance();
        return () => {
            isCancelled = true;
        };
    }, [childId, monthFrom, monthTo, token]);

    const totalDaysInMonth = monthTo.getDate();
    const summary = useMemo(() => summarizeAttendance(records, totalDaysInMonth), [records, totalDaysInMonth]);
    const isCurrentMonth = isSameMonth(month, new Date());

    return (
        <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h5" fontWeight={700}>
                    Attendance
                </Typography>
                <MonthSwitcher
                    monthStart={month}
                    onPrevMonth={() => setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                    onNextMonth={() => setMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                    disableNext={isCurrentMonth}
                />
            </Stack>

            {isLoading ? <Typography color="text.secondary">Loading attendance...</Typography> : null}
            {loadError ? <Typography color="error.main">{loadError}</Typography> : null}

            <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="stretch">
                <Stack flex={1.6} spacing={2}>
                    <MonthCalendar
                        monthStart={month}
                        records={records}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                    />
                    <RecentRecords records={records} />
                </Stack>

                <Stack flex={1} spacing={2}>
                    <AttendanceStats summary={summary} />
                    <Button variant="contained" disabled sx={{ borderRadius: 3 }}>
                        Log Absence (coming soon)
                    </Button>
                </Stack>
            </Stack>
        </Stack>
    );
}

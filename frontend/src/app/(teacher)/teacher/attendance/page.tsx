"use client";

import AttendanceTab from "@/src/components/attendance/AttendanceTab";
import { ErrorState, Spinner } from "@/src/components/ui";
import { useAuth } from "@/src/context/AuthContext";
import { useClassRecords } from "@/src/modules/children/hooks/useClassRecords";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    type SelectChangeEvent,
    Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

export default function TeacherAttendancePage() {
    const { token, hydrated } = useAuth();
    const { children, loading, error } = useClassRecords(token, hydrated);
    const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

    const resolvedChildId = useMemo(() => {
        if (children.length === 0) {
            return null;
        }
        if (selectedChildId != null && children.some((c) => c.id === selectedChildId)) {
            return selectedChildId;
        }
        return children[0].id;
    }, [children, selectedChildId]);

    const handleChildChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        setSelectedChildId(typeof value === "number" ? value : Number(value));
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 1 }}>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight={700}>
                    Attendance
                </Typography>
                <Typography color="text.secondary">
                    View and set attendance for children in your assigned group.
                </Typography>

                {loading ? (
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Spinner centered={false} size={24} />
                        <Typography>Loading class list...</Typography>
                    </Stack>
                ) : error ? (
                    <ErrorState title="Failed to load class list" description={error} actionLabel={undefined} />
                ) : children.length === 0 ? (
                    <Typography color="text.secondary">No children found in your group.</Typography>
                ) : resolvedChildId != null ? (
                    <>
                        <FormControl fullWidth sx={{ maxWidth: 420 }}>
                            <InputLabel id="teacher-attendance-child-label">Child</InputLabel>
                            <Select<number>
                                labelId="teacher-attendance-child-label"
                                label="Child"
                                value={resolvedChildId}
                                onChange={handleChildChange}
                            >
                                {children.map((child) => (
                                    <MenuItem key={child.id} value={child.id}>
                                        {child.firstName} {child.lastName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <AttendanceTab childId={resolvedChildId} audience="teacher" />
                    </>
                ) : null}
            </Stack>
        </Paper>
    );
}

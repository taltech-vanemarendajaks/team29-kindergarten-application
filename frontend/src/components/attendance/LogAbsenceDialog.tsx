"use client";

import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Dialog from "@/src/components/ui/dialog";
import { useAuth } from "@/src/context/AuthContext";
import {
    type AttendanceRecord,
    type AttendanceStatus,
    createAttendance,
    deleteAttendance,
    updateAttendance,
} from "@/src/modules/attendance";
import { ApiRequestError } from "@/src/shared/utils/apiRequestError";

interface LogAbsenceDialogProps {
    open: boolean;
    onClose: () => void;
    childId: number;
    monthStart: Date;
    records: AttendanceRecord[];
    initialDate?: string | null;
    onSaved: (record: AttendanceRecord, mode: "created" | "updated") => void;
    onReset: (date: string) => void;
    onError: (message: string) => void;
}

type AbsenceStatus = Extract<AttendanceStatus, "ABSENT" | "SICK">;

function toIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function clampDateToMonth(iso: string, monthStart: Date, monthEnd: Date): string {
    const minIso = toIsoDate(monthStart);
    const maxIso = toIsoDate(monthEnd);
    if (iso < minIso) {
        return minIso;
    }
    if (iso > maxIso) {
        return maxIso;
    }
    return iso;
}

export default function LogAbsenceDialog({
    open,
    onClose,
    childId,
    monthStart,
    records,
    initialDate,
    onSaved,
    onReset,
    onError,
}: LogAbsenceDialogProps) {
    const { token } = useAuth();

    const monthEnd = useMemo(
        () => new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0),
        [monthStart]
    );
    const minIso = useMemo(() => toIsoDate(monthStart), [monthStart]);
    const maxIso = useMemo(() => toIsoDate(monthEnd), [monthEnd]);

    const resolveInitialDate = (): string => {
        const fallback = toIsoDate(new Date());
        const candidate = initialDate ?? fallback;
        return clampDateToMonth(candidate, monthStart, monthEnd);
    };

    const [date, setDate] = useState<string>(resolveInitialDate);
    const [status, setStatus] = useState<AbsenceStatus>("ABSENT");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }
        const baseIso = initialDate ?? toIsoDate(new Date());
        const nextDate = clampDateToMonth(baseIso, monthStart, monthEnd);
        setDate(nextDate);
        const existing = records.find((record) => record.date === nextDate);
        setStatus(existing && existing.status !== "PRESENT" ? (existing.status as AbsenceStatus) : "ABSENT");
        setValidationError(null);
        // `records` intentionally omitted from deps: we only want to seed status when the dialog opens,
        // not every time the records list is refreshed.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialDate, monthStart, monthEnd]);

    const existingRecord = useMemo(
        () => records.find((record) => record.date === date) ?? null,
        [records, date]
    );

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }
        onClose();
    };

    const handleSubmit = async () => {
        if (!token) {
            setValidationError("Please sign in to log attendance.");
            return;
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            setValidationError("Please choose a valid date.");
            return;
        }

        if (date < minIso || date > maxIso) {
            setValidationError("Date must be within the selected month.");
            return;
        }

        setValidationError(null);

        try {
            setIsSubmitting(true);
            if (existingRecord) {
                const updated = await updateAttendance(token, existingRecord.id, {
                    childId,
                    date,
                    status,
                });
                onSaved(updated, "updated");
            } else {
                const created = await createAttendance(token, {
                    childId,
                    date,
                    status,
                });
                onSaved(created, "created");
            }
            onClose();
        } catch (error) {
            if (error instanceof ApiRequestError) {
                onError(error.message);
            } else {
                onError("Failed to save attendance record. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReset = async () => {
        if (!token || !existingRecord) {
            return;
        }

        try {
            setIsSubmitting(true);
            setValidationError(null);
            await deleteAttendance(token, existingRecord.id);
            onReset(existingRecord.date);
            onClose();
        } catch (error) {
            if (error instanceof ApiRequestError) {
                onError(error.message);
            } else {
                onError("Failed to reset attendance record. Please try again.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitLabel = isSubmitting
        ? "Saving..."
        : existingRecord
        ? "Update Record"
        : "Log Absence";

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title="Log Absence"
            actions={[
                {
                    label: "Cancel",
                    onClick: handleClose,
                    variant: "outlined",
                    color: "inherit",
                    disabled: isSubmitting,
                },
                ...(existingRecord
                    ? [
                          {
                              label: "Reset",
                              onClick: () => {
                                  void handleReset();
                              },
                              variant: "outlined" as const,
                              color: "error" as const,
                              disabled: isSubmitting,
                          },
                      ]
                    : []),
                {
                    label: submitLabel,
                    onClick: () => {
                        void handleSubmit();
                    },
                    disabled: isSubmitting,
                },
            ]}
        >
            <Stack spacing={2} sx={{ pt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    Record an absence for this child within the currently viewed month.
                </Typography>

                <TextField
                    label="Date"
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: minIso, max: maxIso }}
                    fullWidth
                />

                <FormControl fullWidth>
                    <InputLabel id="absence-status-label">Status</InputLabel>
                    <Select
                        labelId="absence-status-label"
                        label="Status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value as AbsenceStatus)}
                    >
                        <MenuItem value="ABSENT">Absent</MenuItem>
                        <MenuItem value="SICK">Sick</MenuItem>
                    </Select>
                    <FormHelperText>
                        Choose Absent for a planned absence or Sick when the child is ill.
                    </FormHelperText>
                </FormControl>

                {existingRecord ? (
                    <Typography variant="body2" color="warning.main">
                        A record for this date already exists ({existingRecord.status}). Submitting will update it, or use
                        Reset to remove the record.
                    </Typography>
                ) : null}

                {validationError ? (
                    <Typography variant="body2" color="error.main">
                        {validationError}
                    </Typography>
                ) : null}
            </Stack>
        </Dialog>
    );
}

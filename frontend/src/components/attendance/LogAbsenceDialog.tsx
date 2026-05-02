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

export type AttendanceDialogAudience = "parent" | "teacher";

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
    /** Parent: only absent/sick. Teacher: present/absent/sick. */
    audience?: AttendanceDialogAudience;
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
    audience = "parent",
}: LogAbsenceDialogProps) {
    const { token } = useAuth();
    const isTeacher = audience === "teacher";

    const monthEnd = useMemo(
        () => new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0),
        [monthStart]
    );
    const minIso = useMemo(() => toIsoDate(monthStart), [monthStart]);
    const maxIso = useMemo(() => toIsoDate(monthEnd), [monthEnd]);
    
    // Parents can only select current and future dates
    const parentMinIso = useMemo(() => toIsoDate(new Date()), []);

    const resolveInitialDate = (): string => {
        const fallback = toIsoDate(new Date());
        const candidate = initialDate ?? fallback;
        const clamped = clampDateToMonth(candidate, monthStart, monthEnd);
        // For parents, ensure the date is not in the past
        if (!isTeacher && clamped < parentMinIso) {
            return parentMinIso;
        }
        return clamped;
    };

    const [date, setDate] = useState<string>(resolveInitialDate);
    const [statusParent, setStatusParent] = useState<AbsenceStatus>("ABSENT");
    const [statusTeacher, setStatusTeacher] = useState<AttendanceStatus>("PRESENT");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }
        const baseIso = initialDate ?? toIsoDate(new Date());
        const nextDate = clampDateToMonth(baseIso, monthStart, monthEnd);
        // For parents, ensure the date is not in the past
        const finalDate = (!isTeacher && nextDate < parentMinIso) ? parentMinIso : nextDate;
        setDate(finalDate);
        setValidationError(null);
    }, [open, initialDate, monthStart, monthEnd, isTeacher, parentMinIso]);

    useEffect(() => {
        if (!open) {
            return;
        }
        const existing = records.find((record) => record.date === date);
        if (isTeacher) {
            setStatusTeacher(existing ? existing.status : "PRESENT");
        } else {
            setStatusParent(existing && existing.status !== "PRESENT" ? (existing.status as AbsenceStatus) : "ABSENT");
        }
    }, [open, date, records, isTeacher]);

    const existingRecord = useMemo(
        () => records.find((record) => record.date === date) ?? null,
        [records, date]
    );
    const isParentPresentLocked = !isTeacher && existingRecord?.status === "PRESENT";

    const handleClose = () => {
        if (isSubmitting) {
            return;
        }
        onClose();
    };

    const handleSubmit = async () => {
        if (isParentPresentLocked) {
            setValidationError("Present records are set by teachers and cannot be edited by parents.");
            return;
        }
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

    // Parents can only mark current and future dates
    if (!isTeacher && date < parentMinIso) {
        setValidationError("Parents can only mark attendance for current and future dates.");
        return;
    }

        setValidationError(null);

        const statusToSave: AttendanceStatus = isTeacher ? statusTeacher : statusParent;

        try {
            setIsSubmitting(true);
            if (existingRecord) {
                const updated = await updateAttendance(token, existingRecord.id, {
                    childId,
                    date,
                    status: statusToSave,
                });
                onSaved(updated, "updated");
            } else {
                const created = await createAttendance(token, {
                    childId,
                    date,
                    status: statusToSave,
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
        if (isParentPresentLocked) {
            setValidationError("Present records are set by teachers and cannot be edited by parents.");
            return;
        }
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
          ? "Update record"
          : isTeacher
            ? "Save record"
            : "Log absence";

    const dialogTitle = isTeacher ? "Log attendance" : "Log absence";

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            title={dialogTitle}
            actions={[
                {
                    label: "Cancel",
                    onClick: handleClose,
                    variant: "outlined",
                    color: "inherit",
                    disabled: isSubmitting,
                },
                ...(existingRecord
                    && !isParentPresentLocked
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
                    disabled: isSubmitting || isParentPresentLocked,
                },
            ]}
        >
            <Stack spacing={2} sx={{ pt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                    {isTeacher
                        ? "Set attendance for this child for a date in the month you are viewing."
                        : "Record an absence for this child within the currently viewed month."}
                </Typography>

        <TextField
            label="Date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ 
                min: isTeacher ? minIso : (minIso > parentMinIso ? minIso : parentMinIso),
                max: maxIso 
            }}
            fullWidth
        />

                <FormControl fullWidth>
                    <InputLabel id="absence-status-label">Status</InputLabel>
                    {isTeacher ? (
                        <Select
                            labelId="absence-status-label"
                            label="Status"
                            value={statusTeacher}
                            onChange={(event) => setStatusTeacher(event.target.value as AttendanceStatus)}
                        >
                            <MenuItem value="PRESENT">Present</MenuItem>
                            <MenuItem value="ABSENT">Absent</MenuItem>
                            <MenuItem value="SICK">Sick</MenuItem>
                        </Select>
                    ) : (
                        <Select
                            labelId="absence-status-label"
                            label="Status"
                            value={statusParent}
                            onChange={(event) => setStatusParent(event.target.value as AbsenceStatus)}
                        >
                            <MenuItem value="ABSENT">Absent</MenuItem>
                            <MenuItem value="SICK">Sick</MenuItem>
                        </Select>
                    )}
                    <FormHelperText>
                        {isTeacher
                            ? "Present marks the child as attended; absent and sick match parent-reported statuses."
                            : "Choose Absent for a planned absence or Sick when the child is ill."}
                    </FormHelperText>
                </FormControl>

                {existingRecord ? (
                    <Typography variant="body2" color="warning.main">
                        {isParentPresentLocked
                            ? `A record for this date already exists (${existingRecord.status}).`
                            : `A record for this date already exists (${existingRecord.status}). Submitting will update it, or use Reset to remove the record.`}
                    </Typography>
                ) : null}

                {isParentPresentLocked ? (
                    <Typography variant="body2" color="info.main">
                        This record is marked Present by a teacher and is read-only for parents.
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

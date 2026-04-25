import { Paper, Stack, Typography } from "@mui/material";

export default function TeacherAttendancePage() {
  return (
    <Paper sx={{ p: 3, borderRadius: 1 }}>
      <Stack spacing={1}>
        <Typography variant="h4" fontWeight={700}>
          Attendance
        </Typography>
        <Typography color="text.secondary">
          Mark and review group attendance. Functionality will be connected here
          next.
        </Typography>
      </Stack>
    </Paper>
  );
}

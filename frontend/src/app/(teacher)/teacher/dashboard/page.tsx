import { Paper, Stack, Typography } from "@mui/material";

export default function TeacherPage() {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4">Teacher</Typography>
        <Typography color="text.secondary">
          Placeholder page for the teacher module.
        </Typography>
      </Stack>
    </Paper>
  );
}

import { Paper, Stack, Typography } from "@mui/material";

export default function AdminDashboardPage() {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Typography color="text.secondary">
          Placeholder page for the admin module.
        </Typography>
      </Stack>
    </Paper>
  );
}

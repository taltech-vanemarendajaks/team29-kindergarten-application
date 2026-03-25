import { Paper, Stack, Typography } from "@mui/material";

export default function ParentPage() {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h4">Parent</Typography>
        <Typography color="text.secondary">
          Placeholder page for the parent module.
        </Typography>
      </Stack>
    </Paper>
  );
}

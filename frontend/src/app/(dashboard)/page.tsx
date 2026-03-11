"use client";

import { Chip, Paper, Stack, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Team 29 Kindergarten Application</Typography>
        <Typography color="text.secondary">
          Base layout is connected with React MUI and is shared for all pages.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip color="primary" label="MUI Theme" />
          <Chip color="secondary" label="CssBaseline" />
          <Chip variant="outlined" label="Shared Layout" />
        </Stack>
      </Stack>
    </Paper>
  );
}

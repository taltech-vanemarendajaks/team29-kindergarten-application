"use client";

import Link from "next/link";
import { Button, Paper, Stack, Typography } from "@mui/material";

export default function HomePage() {
  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Team 29 Kindergarten Application</Typography>
        <Typography color="text.secondary">
          Select one of the module pages below.
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button component={Link} href="/admin-dashboard" variant="contained">
            Admin Dashboard
          </Button>
          <Button component={Link} href="/teacher" variant="outlined">
            Teacher
          </Button>
          <Button component={Link} href="/parent" variant="outlined">
            Parent
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

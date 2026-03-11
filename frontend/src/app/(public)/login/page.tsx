"use client";

import { Button, Paper, Stack, TextField, Typography } from "@mui/material";

export default function LoginPage() {
  return (
    <Paper sx={{ maxWidth: 420, mx: "auto", mt: 8, p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Login Page</Typography>
        <TextField fullWidth label="Email" type="email" />
        <TextField fullWidth label="Password" type="password" />
        <Button variant="contained">Sign in</Button>
      </Stack>
    </Paper>
  );
}

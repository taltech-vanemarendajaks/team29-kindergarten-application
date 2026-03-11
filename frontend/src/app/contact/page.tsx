"use client";

import { Button, Paper, Stack, TextField, Typography } from "@mui/material";

export default function ContactPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Contact</Typography>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField fullWidth label="Name" />
          <TextField fullWidth label="Email" type="email" />
          <TextField fullWidth label="Message" minRows={4} multiline />
          <Button color="primary" variant="contained">
            Send message
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}

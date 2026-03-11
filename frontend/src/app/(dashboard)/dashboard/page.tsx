"use client";

import { Card, CardContent, LinearProgress, Stack, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Dashboard</Typography>
      <Typography color="text.secondary">
        Demo widgets confirm that global MUI layout and styles are active here.
      </Typography>

      <Card>
        <CardContent>
          <Typography gutterBottom variant="h6">
            Attendance today
          </Typography>
          <LinearProgress color="primary" value={72} variant="determinate" />
          <Typography sx={{ mt: 1 }} variant="body2">
            72% of children already checked in.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}

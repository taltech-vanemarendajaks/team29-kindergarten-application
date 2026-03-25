"use client";

import type { ReactNode } from "react";
import { Box, Typography } from "@mui/material";

export type NoResultsProps = {
  title?: ReactNode;
  description?: ReactNode;
};

export default function NoResults({
  title = "No results found",
  description = "Try changing search or filters.",
}: NoResultsProps) {
  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 3, textAlign: "center" }}>
      <Typography sx={{ mb: 0.5 }} variant="h6">
        {title}
      </Typography>
      <Typography color="text.secondary" variant="body2">
        {description}
      </Typography>
    </Box>
  );
}

"use client";

import { Box, CircularProgress } from "@mui/material";
import type { CircularProgressProps } from "@mui/material";

export type LoaderProps = CircularProgressProps & {
  centered?: boolean;
};

export default function Loader({ centered = true, ...props }: LoaderProps) {
  if (!centered) {
    return <CircularProgress {...props} />;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 3 }}>
      <CircularProgress {...props} />
    </Box>
  );
}

"use client";

import type { ReactNode } from "react";
import { Box, Button, Stack } from "@mui/material";
import type { ButtonProps } from "@mui/material";

export type FiltersProps = {
  children: ReactNode;
  onApply?: () => void;
  onReset?: () => void;
  showActions?: boolean;
  applyLabel?: string;
  resetLabel?: string;
  applyButtonProps?: Omit<ButtonProps, "children" | "onClick">;
  resetButtonProps?: Omit<ButtonProps, "children" | "onClick">;
};

export default function Filters({
  children,
  onApply,
  onReset,
  showActions = true,
  applyLabel = "Apply",
  resetLabel = "Reset",
  applyButtonProps,
  resetButtonProps,
}: FiltersProps) {
  return (
    <Box sx={{ border: 1, borderColor: "divider", borderRadius: 2, p: 2 }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          {children}
        </Stack>
        {showActions && (
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
            <Button onClick={onReset} variant="text" {...resetButtonProps}>
              {resetLabel}
            </Button>
            <Button onClick={onApply} variant="contained" {...applyButtonProps}>
              {applyLabel}
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { Box, Popover as MuiPopover } from "@mui/material";
import type { PopoverProps as MuiPopoverProps } from "@mui/material";

export type PopoverProps = Omit<MuiPopoverProps, "open" | "anchorEl" | "onClose" | "children"> & {
  trigger: ReactNode;
  children: ReactNode;
};

export default function Popover({ trigger, children, ...props }: PopoverProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Box component="span" onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ cursor: "pointer" }}>
        {trigger}
      </Box>
      <MuiPopover anchorEl={anchorEl} onClose={() => setAnchorEl(null)} open={open} {...props}>
        <Box sx={{ p: 2 }}>{children}</Box>
      </MuiPopover>
    </>
  );
}

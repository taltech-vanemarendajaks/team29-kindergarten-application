"use client";

import type { ReactNode } from "react";
import { Box, Drawer, Typography } from "@mui/material";
import type { DrawerProps as MuiDrawerProps } from "@mui/material";

export type DrawerPanelProps = Omit<MuiDrawerProps, "children"> & {
  title?: ReactNode;
  children: ReactNode;
  width?: number;
};

export default function DrawerPanel({
  title,
  children,
  width = 420,
  anchor = "right",
  ...props
}: DrawerPanelProps) {
  return (
    <Drawer anchor={anchor} {...props}>
      <Box sx={{ width, maxWidth: "100vw", p: 2 }}>
        {title && (
          <Typography sx={{ mb: 2, fontWeight: 700 }} variant="h6">
            {title}
          </Typography>
        )}
        {children}
      </Box>
    </Drawer>
  );
}

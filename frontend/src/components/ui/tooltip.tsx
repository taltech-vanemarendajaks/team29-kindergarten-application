"use client";

import type { ReactElement, ReactNode } from "react";
import { Tooltip as MuiTooltip } from "@mui/material";
import type { TooltipProps as MuiTooltipProps } from "@mui/material";

export type TooltipProps = Omit<MuiTooltipProps, "title" | "children"> & {
  title: ReactNode;
  children: ReactElement;
};

export default function Tooltip({ title, children, ...props }: TooltipProps) {
  return (
    <MuiTooltip title={title} {...props}>
      {children}
    </MuiTooltip>
  );
}

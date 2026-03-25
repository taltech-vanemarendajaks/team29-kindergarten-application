"use client";

import { Chip as MuiChip } from "@mui/material";
import type { ChipProps as MuiChipProps } from "@mui/material";

export type ChipProps = MuiChipProps;

export default function Chip(props: ChipProps) {
  return <MuiChip size="small" variant="outlined" {...props} />;
}

export function Tag(props: ChipProps) {
  return <Chip {...props} />;
}

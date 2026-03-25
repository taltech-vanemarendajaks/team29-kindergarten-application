"use client";

import { Badge as MuiBadge } from "@mui/material";
import type { BadgeProps as MuiBadgeProps } from "@mui/material";

export type BadgeProps = MuiBadgeProps;

export default function Badge(props: BadgeProps) {
  return <MuiBadge {...props} />;
}

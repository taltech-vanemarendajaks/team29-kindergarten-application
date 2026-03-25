"use client";

import { Skeleton as MuiSkeleton, Stack } from "@mui/material";
import type { SkeletonProps as MuiSkeletonProps } from "@mui/material";

export type SkeletonProps = MuiSkeletonProps & {
  rows?: number;
};

export default function Skeleton({ rows = 1, ...props }: SkeletonProps) {
  if (rows <= 1) {
    return <MuiSkeleton {...props} />;
  }

  return (
    <Stack spacing={1}>
      {Array.from({ length: rows }).map((_, index) => (
        <MuiSkeleton key={index} {...props} />
      ))}
    </Stack>
  );
}

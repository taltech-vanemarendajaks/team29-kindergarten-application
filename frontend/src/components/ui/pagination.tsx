"use client";

import { Box, Pagination as MuiPagination } from "@mui/material";
import type { PaginationProps as MuiPaginationProps } from "@mui/material";

export type PaginationProps = MuiPaginationProps;

export default function Pagination(props: PaginationProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", py: 1 }}>
      <MuiPagination color="primary" shape="rounded" {...props} />
    </Box>
  );
}

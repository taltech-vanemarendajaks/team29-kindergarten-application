"use client";

import type { ReactNode } from "react";
import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export type TableColumn<T> = {
  key: keyof T | string;
  label: ReactNode;
  align?: "left" | "right" | "center";
  render?: (row: T) => ReactNode;
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey?: (row: T, index: number) => string;
  size?: "small" | "medium";
};

export default function Table<T>({ columns, rows, rowKey, size = "small" }: TableProps<T>) {
  return (
    <TableContainer component={Paper} variant="outlined">
      <MuiTable size={size}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell align={column.align} key={String(column.key)}>
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow hover key={rowKey?.(row, index) ?? String(index)}>
              {columns.map((column) => (
                <TableCell align={column.align} key={String(column.key)}>
                  {column.render ? column.render(row) : (row as Record<string, ReactNode>)[String(column.key)]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

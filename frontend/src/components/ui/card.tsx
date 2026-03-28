"use client";

import type { ReactNode } from "react";
import { Card as MuiCard, CardActions, CardContent, CardHeader } from "@mui/material";
import type { CardProps as MuiCardProps } from "@mui/material";

export type CardProps = MuiCardProps & {
  title?: ReactNode;
  subheader?: ReactNode;
  actions?: ReactNode;
};

export default function Card({ title, subheader, actions, children, ...props }: CardProps) {
  return (
    <MuiCard {...props}>
      {(title || subheader) && <CardHeader subheader={subheader} title={title} />}
      {children && <CardContent>{children}</CardContent>}
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
}

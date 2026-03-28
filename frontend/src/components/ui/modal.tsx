"use client";

import type { ReactNode } from "react";
import { Box, Modal as MuiModal } from "@mui/material";
import type { ModalProps as MuiModalProps, SxProps, Theme } from "@mui/material";

export type ModalProps = Omit<MuiModalProps, "children"> & {
  children: ReactNode;
  panelSx?: SxProps<Theme>;
};

export default function Modal({ children, panelSx, ...props }: ModalProps) {
  return (
    <MuiModal {...props}>
      <Box
        sx={[
          {
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92vw", sm: 560 },
            maxWidth: "100%",
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 3,
            boxShadow: 24,
          },
          ...(Array.isArray(panelSx) ? panelSx : [panelSx]),
        ]}
      >
        {children}
      </Box>
    </MuiModal>
  );
}

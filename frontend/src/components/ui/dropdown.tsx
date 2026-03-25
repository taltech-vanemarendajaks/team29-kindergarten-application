"use client";

import { useState } from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import type { ButtonProps, MenuProps } from "@mui/material";

export type DropdownItem = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

export type DropdownProps = {
  label: string;
  items: DropdownItem[];
  buttonProps?: Omit<ButtonProps, "children" | "onClick">;
  menuProps?: Partial<MenuProps>;
};

export default function Dropdown({ label, items, buttonProps, menuProps }: DropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button {...buttonProps} onClick={(event) => setAnchorEl(event.currentTarget)}>
        {label}
      </Button>
      <Menu anchorEl={anchorEl} onClose={handleClose} open={open} {...menuProps}>
        {items.map((item) => (
          <MenuItem
            disabled={item.disabled}
            key={item.label}
            onClick={() => {
              item.onClick?.();
              handleClose();
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

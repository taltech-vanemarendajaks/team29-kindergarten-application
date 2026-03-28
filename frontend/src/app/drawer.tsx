"use client";

import Link from "next/link";
import { Box, Divider, Drawer as MuiDrawer, List, ListItemButton, ListItemText, Typography } from "@mui/material";
import type { NavItem } from "./navigation";

type DrawerProps = {
  title: string;
  navItems: NavItem[];
  open: boolean;
  onClose: () => void;
};

const drawerWidth = 280;

export default function Drawer({ title, navItems, open, onClose }: DrawerProps) {
  return (
    <MuiDrawer anchor="left" onClose={onClose} open={open} sx={{ display: { xs: "block", md: "none" } }}>
      <Box role="presentation" sx={{ width: drawerWidth }} onClick={onClose}>
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
        <Divider />
        <List>
          {navItems.map((item) => (
            <ListItemButton key={item.href} component={Link} href={item.href}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </MuiDrawer>
  );
}

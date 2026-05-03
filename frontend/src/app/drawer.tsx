"use client";

import Link from "next/link";
import {
  Box,
  Button,
  Divider,
  Drawer as MuiDrawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import LogoutIcon from "@mui/icons-material/Logout";

import { useState } from "react";
import type { NavItem } from "./navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

type DrawerProps = {
  title: string;
  navItems: NavItem[];
  open: boolean;
  onClose: () => void;
};

const drawerWidth = 280;

export default function Drawer({ title, navItems, open, onClose }: DrawerProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Check if navItems contains a logout link
  const hasLogoutItem = navItems.some(
    item => "href" in item && item.href === "/logout"
  );

  const toggle = (label: string) => {
    setOpenMenu((prev) => (prev === label ? null : label));
  };

  return (
      <MuiDrawer
          anchor="left"
          onClose={onClose}
          open={open}
          sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box role="presentation" sx={{ width: drawerWidth }} onClick={onClose}>
          <Box sx={{ px: 2, py: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Box>

          <Divider />

          <List>
            {navItems.map((item) =>
                "href" in item ? (
                    // simple link
                    <ListItemButton
                        key={item.href}
                        component={Link}
                        href={item.href}
                    >
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                ) : (
                    // dropdown
                    <Box key={item.label}>
                      <ListItemButton onClick={() => toggle(item.label)}>
                        <ListItemText primary={item.label} />
                        {openMenu === item.label ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>

                      <Collapse in={openMenu === item.label} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {item.children.map((child) => (
                              <ListItemButton
                                  key={child.href}
                                  component={Link}
                                  href={child.href}
                                  sx={{ pl: 4 }}
                              >
                                <ListItemText primary={child.label} />
                              </ListItemButton>
                          ))}
                        </List>
                      </Collapse>
                    </Box>
                )
            )}
      </List>

      {isAuthenticated && (
        <Box sx={{ mt: "auto", pt: 2 }}>
          <Divider />
          <Button
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              mt: 2,
              justifyContent: "flex-start",
              px: 2,
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Box>
  </MuiDrawer>
);
}

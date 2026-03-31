"use client";

import Link from "next/link";
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Typography } from "@mui/material";
import type { NavItem } from "./navigation";
import { useAuth } from "@/src/context/AuthContext";
import LogoutButton from "@/src/components/LogoutButton";

type HeaderProps = {
  title: string;
  navItems: NavItem[];
  onOpenDrawer: () => void;
};

export default function Header({ title, navItems, onOpenDrawer }: HeaderProps) {
  const { isAuthenticated } = useAuth();


  return (
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <IconButton
              aria-label="open navigation menu"
              color="inherit"
              edge="start"
              onClick={onOpenDrawer}
              sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <Typography variant="button">Menu</Typography>
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            {title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
            {navItems.map((item) => (
                <Button
                    key={item.href}
                    color="inherit"
                    component={Link}
                    href={item.href}
                    variant="text"
                >
                  {item.label}
                </Button>
            ))}
            {isAuthenticated && <LogoutButton />}
          </Stack>
        </Toolbar>

        <Box sx={{ borderBottom: 1, borderColor: "divider", opacity: 0.2 }} />
      </AppBar>
  );
}
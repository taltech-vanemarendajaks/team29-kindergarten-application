"use client";

import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import type { NavItem } from "./navigation";
import { useAuth } from "@/src/context/AuthContext";
import LogoutButton from "@/src/components/LogoutButton";
import { useState } from "react";

type HeaderProps = {
    title: string;
    navItems: NavItem[];
    onOpenDrawer: () => void;
};

export default function Header({ title, navItems, onOpenDrawer }: HeaderProps) {
    const { isAuthenticated, hydrated } = useAuth();

    if (!hydrated) return null;

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
        <MenuIcon />
      </IconButton>

                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                    {title}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ display: { xs: "none", md: "flex" } }}>
                    {navItems.map((item) =>
                        "children" in item ? (
                            <HeaderDropdown key={item.label} item={item} />
                        ) : (
                            <HeaderButton key={item.href} href={item.href}>
                                {item.label}
                            </HeaderButton>
                        )
                    )}

                    {isAuthenticated && <LogoutButton />}
                </Stack>
            </Toolbar>

            <Box sx={{ borderBottom: 1, borderColor: "divider", opacity: 0.2 }} />
        </AppBar>
    );
}

function HeaderButton({
                          href,
                          children,
                      }: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Button
            color="inherit"
            component={Link}
            href={href}
            variant="text"
            sx={{
                textTransform: "none",
                fontSize: "0.875rem",
                fontWeight: 400,
                paddingX: 1.5,
                paddingY: 0.75,
                "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                },
            }}
        >
            {children}
        </Button>
    );
}

function HeaderDropdown({ item }: { item: Extract<NavItem, { children: any }> }) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    return (
        <>
            <Button
                color="inherit"
                component="span"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                variant="text"
                sx={{
                    textTransform: "none",
                    fontSize: "0.875rem",
                    fontWeight: 400,
                    paddingX: 1.5,
                    paddingY: 0.75,
                    "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.1)",
                    },
                }}
            >
                {item.label}
            </Button>

            <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
                {item.children.map((child) => (
                    <MenuItem key={child.href} onClick={() => setAnchorEl(null)}>
                        <Link
                            href={child.href}
                            style={{ textDecoration: "none", color: "inherit" }}
                        >
                            {child.label}
                        </Link>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}

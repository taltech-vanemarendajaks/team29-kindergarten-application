"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2f7d32",
    },
    secondary: {
      main: "#ff8f00",
    },
    background: {
      default: "#f6fbf6",
    },
  },
});

const navItems = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/group", label: "Group" },
  { href: "/contact", label: "Contact" },
];

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        <AppBar position="static">
          <Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Kindergarten App
            </Typography>
            <Stack direction="row" spacing={1}>
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
            </Stack>
          </Toolbar>
        </AppBar>

        <Container component="main" sx={{ py: 4, flex: 1 }}>
          {children}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

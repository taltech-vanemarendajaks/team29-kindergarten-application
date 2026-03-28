"use client";

import { useState } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                alert("Invalid credentials");
                return;
            }

            const data = await response.json();

            localStorage.setItem("token", data.token);
            localStorage.setItem("tenantId", data.tenantId);
            localStorage.setItem("roles", JSON.stringify(data.roles));

            const roles = data.roles;

            if (roles.includes("SUPER_ADMIN") || roles.includes("KINDERGARTEN_ADMIN")) {
                router.push("/dashboard/admin");
                return;
            }

            if (roles.includes("TEACHER")) {
                router.push("/dashboard/teacher");
                return;
            }

            if (roles.includes("PARENT")) {
                router.push("/dashboard/parent");
                return;
            }

            // fallback
            router.push("/dashboard");

        } catch (error) {
            console.error(error);
            alert("Login failed");
        }
    }

    return (
        <Paper sx={{ maxWidth: 420, mx: "auto", mt: 8, p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h4">Login Page</Typography>

                <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button variant="contained" onClick={handleLogin}>
                    Sign in
                </Button>
            </Stack>
        </Paper>
    );
}
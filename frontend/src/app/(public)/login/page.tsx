"use client";

import { useState } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import {login} from "@/src/services/auth";
import {redirectByRole} from "@/src/shared/utils/redirectByRole";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        try {
            const data = await login(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem("tenantId", data.tenantId);
            localStorage.setItem("roles", JSON.stringify(data.roles));

            redirectByRole(data.roles, router);

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
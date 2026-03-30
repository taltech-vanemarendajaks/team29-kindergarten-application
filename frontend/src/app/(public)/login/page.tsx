"use client";

import { useState } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { login } from "@/src/services/auth";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { login: saveToken } = useAuth();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await login(email, password);
            saveToken(res.token);
            router.push("/dashboard/parent");
        } catch {
            alert("Login failed");
        }
    };

    return (
        <Paper sx={{ maxWidth: 420, mx: "auto", mt: 8, p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h4">Login</Typography>

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
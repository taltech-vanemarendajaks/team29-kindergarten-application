"use client";

import { useState } from "react";
import { Paper, Stack, TextField, Typography, Button } from "@mui/material";
import { register, login } from "@/src/services/auth";
import { useAuth } from "@/src/context/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const { login: saveToken } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await register({ fullName, email, password });

            const auth = await login(email, password);
            saveToken(auth.token);

            router.push("/parent/dashboard");
        } catch (err) {
            alert("Registration failed");
        }
    };

    return (
        <Paper sx={{ maxWidth: 420, mx: "auto", mt: 8, p: 3 }}>
            <Stack spacing={2}>
                <Typography variant="h4">Create Account</Typography>

                <TextField
                    fullWidth
                    label="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />

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

                <Button variant="contained" onClick={handleRegister}>
                    Create account
                </Button>
            </Stack>
        </Paper>
    );
}
"use client";

import * as React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

const theme = createTheme({
    palette: {
        mode: "light",
    },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [cache] = React.useState(() =>
        createCache({ key: "mui", prepend: true })
    );

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );
}
import AppProvider from "@/src/providers/AppProvider";
import ThemeRegistry from "@/src/providers/ThemeRegistry";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeRegistry>
            <AppProvider>{children}</AppProvider>
        </ThemeRegistry>
        </body>
        </html>
    );
}

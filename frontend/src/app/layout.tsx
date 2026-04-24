import { AuthProvider } from "@/src/context/AuthContext";
import ThemeRegistry from "@/src/providers/ThemeRegistry";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeRegistry>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeRegistry>
        </body>
        </html>
    );
}

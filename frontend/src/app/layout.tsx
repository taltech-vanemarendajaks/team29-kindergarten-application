import { AuthProvider } from "@/src/context/AuthContext";
import ThemeRegistry from "@/src/providers/ThemeRegistry";
import { ReactNode } from "react";
import { ToasterClient } from "@/src/components/ToasterClient";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeRegistry>
            <AuthProvider>
                {children}
                <ToasterClient />
            </AuthProvider>
        </ThemeRegistry>
        </body>
        </html>
    );
}

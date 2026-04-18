import { AuthProvider } from "@/src/context/AuthContext";
import ThemeRegistry from "@/src/providers/ThemeRegistry";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <ThemeRegistry>
            <AuthProvider>
                {children}
                <Toaster position="top-right" />
            </AuthProvider>
        </ThemeRegistry>
        </body>
        </html>
    );
}

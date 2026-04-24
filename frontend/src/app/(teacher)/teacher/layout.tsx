"use client";

import RoleGuard from "@/src/components/RoleGuard";
import { teacherNavItems } from "@/src/components/navigation/teacherNav";
import {ReactNode} from "react";
import MainLayout from "@/src/app/main-layout";
import {Toaster} from "react-hot-toast";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

export default function TeacherLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard allowed={["TEACHER"]}>
            <MainLayout
                title="Teacher Dashboard"
                navItems={teacherNavItems}
                footerText="Teacher Portal">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    {children}
                </LocalizationProvider>
                <Toaster position="top-right" />
            </MainLayout>
        </RoleGuard>
    );
}
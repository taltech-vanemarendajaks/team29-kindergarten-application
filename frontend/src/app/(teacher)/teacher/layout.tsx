import RoleGuard from "@/src/components/RoleGuard";

import { teacherNavItems } from "@/src/components/navigation/teacherNav";
import {ReactNode} from "react";
import MainLayout from "@/src/app/main-layout";
import {Toaster} from "react-hot-toast";

export default function TeacherLayout({ children }: { children: ReactNode }) {
    return (
        <RoleGuard allowed={["TEACHER"]}>
            <MainLayout
                title="Teacher Dashboard"
                navItems={teacherNavItems}
                footerText="Teacher Portal"
            >
                {children}
                <Toaster position="top-right" />
            </MainLayout>
        </RoleGuard>
    );
}
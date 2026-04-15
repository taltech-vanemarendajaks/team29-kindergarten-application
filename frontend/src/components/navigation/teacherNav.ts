import {NavItem} from "@/src/app/navigation";

export const teacherNavItems: NavItem[] = [
    { label: "Dashboard", href: "/teacher/dashboard" },
    { label: "Groups", href: "/teacher/groups" },
    { label: "Attendance", href: "/teacher/attendance" },
    {
        label: "Journal",
        children: [
            { label: "✏️ New Entry", href: "/teacher/journal" },
            { label: "📄 All Entries", href: "/teacher/journal/list" },
        ],
    },
];
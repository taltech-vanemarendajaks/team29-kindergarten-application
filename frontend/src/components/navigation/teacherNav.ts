import { NavItem } from "@/src/app/navigation";

export const teacherNavItems: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard" },
  { label: "Class Records", href: "/teacher/class-records" },
  { label: "Attendance", href: "/teacher/attendance" },
    {
        label: "Journal",
        children: [
            { label: "✏️ New Entry", href: "/teacher/journal" },
            { label: "📄 All Entries", href: "/teacher/journal/list" },
        ],
    },
];

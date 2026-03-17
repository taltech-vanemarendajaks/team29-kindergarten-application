'use client';

import { useListTeachers } from '@/api/generated/hooks/teachers/teachers';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

export default function TeachersPage() {
    const { data, isLoading, error } = useListTeachers();

    if (error) return <Typography color="error">Failed to load teachers</Typography>;

    return (
        <List>
            {data?.data.map(teacher => (
                <ListItem key={teacher.id}>
                    <ListItemText
                        primary={`${teacher.firstName} ${teacher.lastName}`}
                    />
                </ListItem>
            ))}
        </List>
    );
}

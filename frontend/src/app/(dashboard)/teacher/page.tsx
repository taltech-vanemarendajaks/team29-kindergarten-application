import teacherPageData from "@/src/modules/kindergarten/model/teacher-page-data.json";
import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

type TeacherCardItem = {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  groupName: string;
};

type TeacherPageData = {
  tenant: {
    id: string;
    name: string;
  };
  teachers: TeacherCardItem[];
  dailyAttendance: {
    date: string;
    present: number;
    absent: number;
    sick: number;
  };
};

export default function TeacherPage() {
  const data = teacherPageData as TeacherPageData;

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Teacher</Typography>
        <Typography color="text.secondary">
          Test data from JSON for tenant: {data.tenant.name}
        </Typography>

        <Divider />

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6">Daily attendance</Typography>
            <Typography color="text.secondary">
              Date: {data.dailyAttendance.date}
            </Typography>
            <Typography>
              Present: {data.dailyAttendance.present} | Absent:{" "}
              {data.dailyAttendance.absent} | Sick: {data.dailyAttendance.sick}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6">Teachers</Typography>
        <List dense>
          {data.teachers.map((teacher) => (
            <ListItem key={teacher.id} divider>
              <ListItemText
                primary={`${teacher.firstName} ${teacher.lastName}`}
                secondary={`Group: ${teacher.groupName} | Tenant ID: ${teacher.tenantId}`}
              />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  );
}

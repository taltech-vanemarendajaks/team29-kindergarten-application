"use client";

import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/src/context/AuthContext";
import { API_URL } from "@/src/shared/constants/api";

interface DashboardStats {
  children: number;
  groups: number;
  teachers: number;
  attendance: {
    present: number;
    absent: number;
    sick: number;
  };
}

const COLOURS = ["#4caf50", "#f44336", "#ff9800"];

export default function KindergartenAdminDashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${API_URL}/api/v1/children?size=1`, { headers }),
      fetch(`${API_URL}/api/v1/groups?size=1`, { headers }),
      fetch(`${API_URL}/api/v1/users?role=TEACHER&size=1`, { headers }),
      fetch(`${API_URL}/api/v1/attendances/summary`, { headers }),
    ])
      .then(async ([childRes, groupRes, userRes, attRes]) => {
        const [childData, groupData, userData, attData] = await Promise.all([
          childRes.json(),
          groupRes.json(),
          userRes.json(),
          attRes.json(),
        ]);
        setStats({
          children: childData.totalElements ?? 0,
          groups: groupData.totalElements ?? 0,
          teachers: userData.totalElements ?? 0,
          attendance: {
            present: attData.present ?? 0,
            absent: attData.absent ?? 0,
            sick: attData.sick ?? 0,
          },
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  const statCards = stats
    ? [
        { label: "Children", value: stats.children },
        { label: "Groups", value: stats.groups },
        { label: "Teachers", value: stats.teachers },
      ]
    : [];

  const hasAttendance = stats
    ? stats.attendance.present +
        stats.attendance.absent +
        stats.attendance.sick >
      0
    : false;

  const chartData = stats
    ? [
        {
          name: "Present",
          value: hasAttendance ? stats.attendance.present : 1,
        },
        { name: "Absent", value: hasAttendance ? stats.attendance.absent : 1 },
        { name: "Sick", value: hasAttendance ? stats.attendance.sick : 1 },
      ]
    : [];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Kindergarten Admin Dashboard
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {stats && (
        <Stack spacing={4}>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            {statCards.map((card) => (
              <Card key={card.label} sx={{ minWidth: 160, flex: 1 }}>
                <CardContent>
                  <Typography variant="h3" fontWeight={700} color="primary">
                    {card.value}
                  </Typography>
                  <Typography color="text.secondary">{card.label}</Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>

          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Attendance Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLOURS[index]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Stack>
      )}
    </Paper>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Paper,
  Typography,
  Stack,
  Card,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
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

const QUICK_ACTIONS = [
  { label: "Manage Teachers", path: "/kindergarten-admin/teachers" },
  { label: "Manage Groups", path: "/kindergarten-admin/groups" },
];

export default function KindergartenAdminDashboardPage() {
  const { token } = useAuth();
  const router = useRouter();
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

  const total = stats
    ? stats.attendance.present + stats.attendance.absent + stats.attendance.sick
    : 0;

  const hasAttendance = total > 0;

  const presentPct = hasAttendance
    ? Math.round((stats!.attendance.present / total) * 100)
    : 0;

  const chartData = stats
    ? [
        { name: "Present", value: hasAttendance ? stats.attendance.present : 1 },
        { name: "Absent",  value: hasAttendance ? stats.attendance.absent  : 1 },
        { name: "Sick",    value: hasAttendance ? stats.attendance.sick    : 1 },
      ]
    : [];

  const legendItems = [
    { name: "Present",   value: stats?.attendance.present ?? 0, colour: COLOURS[0] },
    { name: "Absent",    value: stats?.attendance.absent  ?? 0, colour: COLOURS[1] },
    { name: "Sick",      value: stats?.attendance.sick    ?? 0, colour: COLOURS[2] },
  ];

  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Kindergarten Admin Dashboard
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {stats && (
        <Stack spacing={4}>

          {/* Stat Cards + Quick Actions */}
          <Stack direction="row" spacing={2} alignItems="flex-start" flexWrap="wrap">
            <Stack direction="row" spacing={2} flexWrap="wrap" flex={1}>
              {statCards.map((card) => (
                <Card key={card.label} sx={{ minWidth: 140, flex: 1 }}>
                  <CardContent>
                    <Typography variant="h3" fontWeight={700} color="primary">
                      {card.value}
                    </Typography>
                    <Typography color="text.secondary">{card.label}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>

            <Card sx={{ minWidth: 180, maxWidth: 220 }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Quick Actions
                </Typography>
                <Stack spacing={1}>
                  {QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.label}
                      variant="contained"
                      fullWidth
                      onClick={() => router.push(action.path)}
                      sx={{ textTransform: "none", fontWeight: 600, justifyContent: "flex-start" }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Stack>

          {/* Attendance Overview */}
          <Box>
            <Typography variant="h6" fontWeight={600} mb={2}>
              Attendance Overview
            </Typography>
            {!hasAttendance && (
              <Typography color="text.secondary" mb={1} variant="body2">
                No attendance records found. Chart shows placeholder data.
              </Typography>
            )}

            <Stack direction="row" alignItems="center" spacing={4}>

              {/* Donut chart with centre label overlay */}
              <Box sx={{ position: "relative", width: 220, height: 220 }}>
                <PieChart width={220} height={220}>
                  <Pie
                    data={chartData}
                    cx={105}
                    cy={105}
                    innerRadius={75}
                    outerRadius={100}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLOURS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>

                {/* Centre label overlay */}
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    pointerEvents: "none",
                  }}
                >
                  <Typography variant="h5" fontWeight={700} lineHeight={1.1}>
                    {hasAttendance ? `${presentPct}%` : "—"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" letterSpacing={1}>
                    PRESENT
                  </Typography>
                </Box>
              </Box>

              {/* Custom legend with values */}
              <Stack spacing={1.5}>
                {legendItems.map((item) => (
                  <Stack key={item.name} direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: item.colour,
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {hasAttendance ? item.value : 0}
                    </Typography>
                  </Stack>
                ))}
              </Stack>

            </Stack>
          </Box>

        </Stack>
      )}
    </Paper>
  );
}

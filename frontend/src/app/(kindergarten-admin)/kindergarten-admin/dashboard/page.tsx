"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardStats } from "@/src/modules/kindergarten-admin/model/dashboardStats";
import { adminQuickActions } from "@/src/components/navigation/adminNav";
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
import { API_URL } from "@/src/services/api";
import GroupsIcon from "@mui/icons-material/Groups";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

const COLOURS = ["#4caf50", "#f44336", "#ff9800"];

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

 const total = stats
    ? stats.attendance.present + stats.attendance.absent + stats.attendance.sick
    : 0;

  const hasAttendance = total > 0;

  const presentPct = hasAttendance
    ? Math.round((stats!.attendance.present / total) * 100)
    : 0;

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

  const legendItems = [
    {
      name: "Present",
      value: stats?.attendance.present ?? 0,
      colour: COLOURS[0],
    },
    {
      name: "Absent",
      value: stats?.attendance.absent ?? 0,
      colour: COLOURS[1],
    },
    { name: "Sick", value: stats?.attendance.sick ?? 0, colour: COLOURS[2] },
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
 <Stack
 direction={{ xs: "column", md: "row" }}
 spacing={2}
 alignItems="stretch"
 >
 <Stack
 direction={{ xs: "column", md: "row" }}
 spacing={2}
 flexWrap="wrap"
 flex={{ xs: "100%", md: 1 }}
 >
 {/* Children Card */}
 <Card variant="outlined" sx={{ flex: 1, borderRadius: 2 }}>
 <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
 <Box
 sx={{
 bgcolor: "success.main",
 color: "common.white",
 borderRadius: 2,
 p: 1.5,
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 }}
 >
 <GroupsIcon />
 </Box>
 <Box>
 <Typography variant="h5" fontWeight={700}>
 {stats.children}
 </Typography>
 <Typography variant="body2" color="text.secondary">
 Children in Group
 </Typography>
 </Box>
 </CardContent>
 </Card>

 {/* Groups Card */}
 <Card variant="outlined" sx={{ flex: 1, borderRadius: 2 }}>
 <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
 <Box
 sx={{
 bgcolor: "warning.light",
 borderRadius: 2,
 p: 1.5,
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 }}
 >
 <SchoolIcon sx={{ color: "common.black" }} />
 </Box>
 <Box>
 <Typography variant="h5" fontWeight={700}>
 {stats.groups}
 </Typography>
 <Typography variant="body2" color="text.secondary">
 Groups
 </Typography>
 </Box>
 </CardContent>
 </Card>

 {/* Teachers Card */}
 <Card variant="outlined" sx={{ flex: 1, borderRadius: 2 }}>
 <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
 <Box
 sx={{
 bgcolor: "info.light",
 borderRadius: 2,
 p: 1.5,
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 }}
 >
 <PersonIcon sx={{ color: "common.black" }} />
 </Box>
 <Box>
 <Typography variant="h5" fontWeight={700}>
 {stats.teachers}
 </Typography>
 <Typography variant="body2" color="text.secondary">
 Teachers
 </Typography>
 </Box>
 </CardContent>
 </Card>
 </Stack>

 <Card
 variant="outlined"
 sx={{
 flex: { xs: "100%", md: "0 0 auto" },
 minWidth: 180,
 }}
 >
              <CardContent>
                <Typography variant="subtitle1" fontWeight={700} mb={1.5}>
                  Quick Actions
                </Typography>
                <Stack spacing={1}>
                  {adminQuickActions.map((action) => (
                    <Button
                      key={action.label}
                      variant="contained"
                      fullWidth
                      onClick={() => router.push(action.path)}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        justifyContent: "flex-start",
                      }}
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

            <Stack direction={{ xs: "column", md: "row" }} alignItems={{ xs: "flex-start", md: "center" }} spacing={4}>
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
                    // isAnimationActive={false}
                  >
                    {chartData.map((_, index) => (
                      <Cell key={index} fill={COLOURS[index]} />
                    ))}
                  </Pie>
                  {hasAttendance && <Tooltip />}{" "}
                </PieChart>

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
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    letterSpacing={1}
                  >
                    PRESENT
                  </Typography>
                </Box>
              </Box>

              <Stack spacing={1.5}>
                {legendItems.map((item) => (
                  <Stack
                    key={item.name}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: item.colour,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 60 }}
                    >
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

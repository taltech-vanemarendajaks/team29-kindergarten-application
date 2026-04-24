"use client";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useAuth } from "@/src/context/AuthContext";
import { useClassRecords } from "@/src/modules/children/hooks/useClassRecords";
import { Spinner, ErrorState } from "@/src/components/ui";

export default function ClassRecordsPage() {
  const { token, hydrated } = useAuth();
  const { children, loading, error } = useClassRecords(token, hydrated);

  return (
    <Paper sx={{ p: 3, borderRadius: 1 }}>
      <Stack spacing={2}>
        <Typography variant="h4" fontWeight={700}>
          Class Records
        </Typography>
        <Typography color="text.secondary">
          Children in your assigned group
        </Typography>

        {loading ? (
          <Stack direction="row" spacing={2} alignItems="center">
            <Spinner centered={false} size={24} />
            <Typography>Loading class records...</Typography>
          </Stack>
        ) : error ? (
          <ErrorState
            title="Failed to load class records"
            description={error}
            actionLabel={undefined}
          />
        ) : children.length === 0 ? (
          <Typography color="text.secondary">
            No children found in your group.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>First Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Last Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Date of Birth</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Group Name</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {children.map((child) => (
                  <TableRow key={child.id}>
                    <TableCell>{child.firstName}</TableCell>
                    <TableCell>{child.lastName}</TableCell>
                    <TableCell>{child.birthDate}</TableCell>
                    <TableCell>{child.groupName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Stack>
    </Paper>
  );
}

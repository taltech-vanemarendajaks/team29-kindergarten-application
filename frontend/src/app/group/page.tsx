"use client";

import { Chip, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";

const groups = [
  { name: "Sunflowers", age: "3-4 years", students: 18 },
  { name: "Rainbows", age: "4-5 years", students: 20 },
  { name: "Explorers", age: "5-6 years", students: 17 },
];

export default function GroupPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Group</Typography>
      <Paper>
        <List>
          {groups.map((group) => (
            <ListItem key={group.name} divider>
              <ListItemText
                primary={group.name}
                secondary={`${group.age} • ${group.students} students`}
              />
              <Chip color="primary" label="Active" size="small" />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Stack>
  );
}

import parentPageData from "@/src/modules/kindergarten/model/parent-page-data.json";
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

type ParentCardItem = {
  id: string;
  tenantId: string;
  email: string;
  phone: string;
  childName: string;
};

type ParentPageData = {
  tenant: {
    id: string;
    name: string;
  };
  parents: ParentCardItem[];
  monthlyPayments: {
    month: string;
    paid: number;
    pending: number;
    failed: number;
  };
};

export default function ParentPage() {
  const data = parentPageData as ParentPageData;

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Typography variant="h4">Parent</Typography>
        <Typography color="text.secondary">
          Test data from JSON for tenant: {data.tenant.name}
        </Typography>

        <Divider />

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6">Monthly payments</Typography>
            <Typography color="text.secondary">
              Month: {data.monthlyPayments.month}
            </Typography>
            <Typography>
              Paid: {data.monthlyPayments.paid} | Pending:{" "}
              {data.monthlyPayments.pending} | Failed:{" "}
              {data.monthlyPayments.failed}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h6">Parents</Typography>
        <List dense>
          {data.parents.map((parent) => (
            <ListItem key={parent.id} divider>
              <ListItemText
                primary={`${parent.email} (${parent.phone})`}
                secondary={`Child: ${parent.childName} | Tenant ID: ${parent.tenantId}`}
              />
            </ListItem>
          ))}
        </List>
      </Stack>
    </Paper>
  );
}

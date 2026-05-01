export interface DashboardStats {
  children: number;
  groups: number;
  teachers: number;
  attendance: {
    present: number;
    absent: number;
    sick: number;
  };
}

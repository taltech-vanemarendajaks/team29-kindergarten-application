import type {
  Attendance,
  Child,
  ChildParent,
  GroupEntity,
  Meal,
  Menu,
  Parent,
  Payment,
  Teacher,
  Tenant,
} from "@/src/shared/types/kindergarten";

export const tenantFixture: Tenant = {
  id: "1",
  name: "Sunrise Kindergarten",
  address: "123 Maple Street",
  contactInfo: "+1-555-0101",
  subscriptionPlan: "PRO",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const parentFixture: Parent = {
  id: "11",
  tenantId: "1",
  email: "parent@example.com",
  phone: "+1-555-0102",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const teacherFixture: Teacher = {
  id: "21",
  tenantId: "1",
  firstName: "Anna",
  lastName: "Smith",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const groupFixture: GroupEntity = {
  id: "31",
  tenantId: "1",
  name: "Stars",
  ageRange: "4-5",
  teacherId: "21",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const childFixture: Child = {
  id: "41",
  tenantId: "1",
  firstName: "Mia",
  lastName: "Brown",
  birthDate: "2021-04-10",
  groupId: "31",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const childParentFixture: ChildParent = {
  tenantId: "1",
  childId: "41",
  parentId: "11",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const attendanceFixture: Attendance = {
  id: "51",
  tenantId: "1",
  childId: "41",
  date: "2026-03-08",
  status: "PRESENT",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const paymentFixture: Payment = {
  id: "61",
  tenantId: "1",
  parentId: "11",
  amount: "145.50",
  month: "2026-03-01",
  status: "PAID",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const menuFixture: Menu = {
  id: "71",
  tenantId: "1",
  date: "2026-03-08",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

export const mealFixture: Meal = {
  id: "81",
  tenantId: "1",
  menuId: "71",
  mealType: "LUNCH",
  description: "Chicken soup and vegetables",
  createdAt: "2026-03-07T19:50:21Z",
  updatedAt: "2026-03-07T19:50:21Z",
  deletedAt: null,
};

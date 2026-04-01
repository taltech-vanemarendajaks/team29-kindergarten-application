export type DbBigInt = string;
export type DbDecimal = string;
export type DbDate = string;
export type DbTimestamp = string;

export type AttendanceStatus = "PRESENT" | "ABSENT" | "SICK";
export type PaymentStatus = "PAID" | "PENDING" | "FAILED";
export type MealType = "BREAKFAST" | "LUNCH" | "SNACK" | "DINNER";

export type AuditFields = {
  createdAt: DbTimestamp;
  updatedAt: DbTimestamp;
  deletedAt: DbTimestamp | null;
};

export type ChildParentKey = {
  childId: DbBigInt;
  parentId: DbBigInt;
};

export type Tenant = AuditFields & {
  id: DbBigInt;
  name: string | null;
  address: string | null;
  contactInfo: string | null;
  subscriptionPlan: string | null;
};

export type Parent = AuditFields & {
  id: DbBigInt;
  tenantId: DbBigInt | null;
  email: string | null;
  phone: string | null;
};

export type Teacher = AuditFields & {
  id: DbBigInt;
  tenantId: DbBigInt | null;
  firstName: string | null;
  lastName: string | null;
};

// Maps SQL table "group" to a safe TS type name.
export type GroupEntity = AuditFields & {
  id: DbBigInt;
  tenantId: DbBigInt | null;
  name: string | null;
  ageRange: string | null;
  teacherId: DbBigInt | null;
};

export type Child = AuditFields & {
  id: DbBigInt;
  tenantId: DbBigInt | null;
  firstName: string | null;
  lastName: string | null;
  birthDate: DbDate | null;
  groupId: DbBigInt | null;
};

export type ChildParent = AuditFields &
  ChildParentKey & {
    tenantId: DbBigInt | null;
  };

export type Attendance = AuditFields & {
  id: DbBigInt;
  tenantId: DbBigInt | null;
  childId: DbBigInt | null;
  date: DbDate | null;
  status: AttendanceStatus | null;
};

export type Payment = AuditFields & {
  id: DbBigInt;
  tenantId: DbBigInt | null;
  parentId: DbBigInt | null;
  amount: DbDecimal | null;
  month: DbDate | null;
  status: PaymentStatus | null;
};

export type Menu = AuditFields & {
  id: DbBigInt;
  tenantId: DbBigInt | null;
  date: DbDate | null;
};

export type Meal = AuditFields & {
  id: DbBigInt;
  tenantId: DbBigInt | null;
  menuId: DbBigInt | null;
  mealType: MealType | null;
  description: string | null;
};

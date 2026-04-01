import type {
  AttendanceStatus,
  DbBigInt,
  DbDate,
  DbDecimal,
  DbTimestamp,
  MealType,
  PaymentStatus,
} from "@/src/shared/types/kindergarten";

export type TenantDto = {
  id: DbBigInt;
  name: string | null;
  address: string | null;
  contact_info: string | null;
  subscription_plan: string | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type ParentDto = {
  id: DbBigInt;
  tenant_id: DbBigInt | null;
  email: string | null;
  phone: string | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type TeacherDto = {
  id: DbBigInt;
  tenant_id: DbBigInt | null;
  first_name: string | null;
  last_name: string | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type GroupDto = {
  id: DbBigInt;
  tenant_id: DbBigInt | null;
  name: string | null;
  age_range: string | null;
  teacher_id: DbBigInt | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type ChildDto = {
  id: DbBigInt;
  tenant_id: DbBigInt | null;
  first_name: string | null;
  last_name: string | null;
  birth_date: DbDate | null;
  group_id: DbBigInt | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type ChildParentDto = {
  tenant_id: DbBigInt | null;
  child_id: DbBigInt;
  parent_id: DbBigInt;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type AttendanceDto = {
  id: DbBigInt;
  tenant_id: DbBigInt | null;
  child_id: DbBigInt | null;
  date: DbDate | null;
  status: AttendanceStatus | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type PaymentDto = {
  id: DbBigInt;
  tenant_id: DbBigInt | null;
  parent_id: DbBigInt | null;
  amount: DbDecimal | null;
  month: DbDate | null;
  status: PaymentStatus | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type MenuDto = {
  id: DbBigInt;
  tenant_id: DbBigInt | null;
  date: DbDate | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

export type MealDto = {
  id: DbBigInt;
  tenant_id: DbBigInt | null;
  menu_id: DbBigInt | null;
  meal_type: MealType | null;
  description: string | null;
  created_at: DbTimestamp;
  updated_at: DbTimestamp;
  deleted_at: DbTimestamp | null;
};

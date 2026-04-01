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
import type {
  AttendanceDto,
  ChildDto,
  ChildParentDto,
  GroupDto,
  MealDto,
  MenuDto,
  ParentDto,
  PaymentDto,
  TeacherDto,
  TenantDto,
} from "./models";

export const mapTenantDto = (dto: TenantDto): Tenant => ({
  id: dto.id,
  name: dto.name,
  address: dto.address,
  contactInfo: dto.contact_info,
  subscriptionPlan: dto.subscription_plan,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapParentDto = (dto: ParentDto): Parent => ({
  id: dto.id,
  tenantId: dto.tenant_id,
  email: dto.email,
  phone: dto.phone,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapTeacherDto = (dto: TeacherDto): Teacher => ({
  id: dto.id,
  tenantId: dto.tenant_id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapGroupDto = (dto: GroupDto): GroupEntity => ({
  id: dto.id,
  tenantId: dto.tenant_id,
  name: dto.name,
  ageRange: dto.age_range,
  teacherId: dto.teacher_id,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapChildDto = (dto: ChildDto): Child => ({
  id: dto.id,
  tenantId: dto.tenant_id,
  firstName: dto.first_name,
  lastName: dto.last_name,
  birthDate: dto.birth_date,
  groupId: dto.group_id,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapChildParentDto = (dto: ChildParentDto): ChildParent => ({
  tenantId: dto.tenant_id,
  childId: dto.child_id,
  parentId: dto.parent_id,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapAttendanceDto = (dto: AttendanceDto): Attendance => ({
  id: dto.id,
  tenantId: dto.tenant_id,
  childId: dto.child_id,
  date: dto.date,
  status: dto.status,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapPaymentDto = (dto: PaymentDto): Payment => ({
  id: dto.id,
  tenantId: dto.tenant_id,
  parentId: dto.parent_id,
  amount: dto.amount,
  month: dto.month,
  status: dto.status,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapMenuDto = (dto: MenuDto): Menu => ({
  id: dto.id,
  tenantId: dto.tenant_id,
  date: dto.date,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

export const mapMealDto = (dto: MealDto): Meal => ({
  id: dto.id,
  tenantId: dto.tenant_id,
  menuId: dto.menu_id,
  mealType: dto.meal_type,
  description: dto.description,
  createdAt: dto.created_at,
  updatedAt: dto.updated_at,
  deletedAt: dto.deleted_at,
});

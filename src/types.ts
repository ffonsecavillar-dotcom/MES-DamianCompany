export type Role = "administrador" | "ventas" | "ingenieria" | "produccion" | "compras" | "finanzas";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Entity = {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export type CollectionName =
  | "users"
  | "clients"
  | "requests"
  | "quotes"
  | "projects"
  | "tasks"
  | "technicalFiles"
  | "workOrders"
  | "machines"
  | "inventory"
  | "inventoryMovements"
  | "suppliers"
  | "purchases"
  | "qualityInspections"
  | "deliveries"
  | "payments"
  | "costs"
  | "auditEvents";

export type FieldType = "text" | "textarea" | "number" | "date" | "select" | "json";

export type FieldConfig = {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
};

export type ModuleConfig = {
  key: CollectionName;
  title: string;
  description: string;
  columns: string[];
  fields: FieldConfig[];
  primary: string;
  statusKey?: string;
};

export type DashboardData = {
  metrics: Record<string, number>;
  production: Entity[];
  machines: Entity[];
  lowStockItems: Entity[];
  pendingPurchases: Entity[];
  pendingTasks: Entity[];
  payments: Entity[];
};

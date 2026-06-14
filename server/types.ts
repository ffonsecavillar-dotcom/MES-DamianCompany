export const collections = [
  "users",
  "clients",
  "requests",
  "quotes",
  "projects",
  "tasks",
  "technicalFiles",
  "workOrders",
  "machines",
  "inventory",
  "inventoryMovements",
  "suppliers",
  "purchases",
  "qualityInspections",
  "deliveries",
  "payments",
  "costs",
  "auditEvents"
] as const;

export type CollectionName = (typeof collections)[number];

export type Role =
  | "administrador"
  | "ventas"
  | "ingenieria"
  | "produccion"
  | "compras"
  | "finanzas";

export type EntityRecord = {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
};

export type AppData = Record<CollectionName, EntityRecord[]>;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Store = {
  init(): Promise<void>;
  list(collection: CollectionName): Promise<EntityRecord[]>;
  get(collection: CollectionName, id: string): Promise<EntityRecord | undefined>;
  create(collection: CollectionName, data: Record<string, unknown>): Promise<EntityRecord>;
  update(collection: CollectionName, id: string, patch: Record<string, unknown>): Promise<EntityRecord>;
  remove(collection: CollectionName, id: string): Promise<void>;
  replaceAll(data: AppData): Promise<void>;
};

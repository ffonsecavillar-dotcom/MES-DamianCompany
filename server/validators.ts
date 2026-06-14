import { z } from "zod";
import { collections, type CollectionName } from "./types.js";

const baseSchema = z.record(z.string(), z.unknown());

const requiredByCollection: Partial<Record<CollectionName, string[]>> = {
  users: ["name", "email", "role"],
  clients: ["name", "status"],
  requests: ["clientName", "description", "status"],
  quotes: ["clientName", "status"],
  projects: ["name", "clientName", "status"],
  workOrders: ["projectName", "type", "status"],
  machines: ["name", "type", "status"],
  inventory: ["name", "category", "unit", "stock", "minimum"],
  purchases: ["supplier", "item", "status"],
  qualityInspections: ["projectName", "status"],
  deliveries: ["projectName", "clientName", "status"],
  payments: ["projectName", "clientName", "amount", "status"],
  costs: ["projectName", "category", "estimated", "real"]
};

export const parseCollection = (value: string): CollectionName => {
  if (!collections.includes(value as CollectionName)) {
    throw new Error("Modulo no reconocido");
  }
  return value as CollectionName;
};

export const validatePayload = (collection: CollectionName, payload: unknown) => {
  const parsed = baseSchema.parse(payload);
  for (const key of requiredByCollection[collection] ?? []) {
    if (parsed[key] === undefined || parsed[key] === "") {
      throw new Error(`Campo requerido: ${key}`);
    }
  }
  return parsed;
};

import type { CollectionName, DashboardData, Entity, User } from "./types";

const API_BASE = "/api";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let authToken = localStorage.getItem("mes.token") ?? "";

export const setToken = (token: string) => {
  authToken = token;
  localStorage.setItem("mes.token", token);
};

export const clearToken = () => {
  authToken = "";
  localStorage.removeItem("mes.token");
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (authToken) headers.set("Authorization", `Bearer ${authToken}`);

  const response = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new ApiError(body.message ?? "Error de API", response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
};

export const api = {
  login: (email: string, password: string) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  me: () => request<{ user: User }>("/auth/me"),
  dashboard: () => request<DashboardData>("/dashboard"),
  list: (collection: CollectionName) => request<Entity[]>(`/${collection}`),
  create: (collection: CollectionName, data: Record<string, unknown>) =>
    request<Entity>(`/${collection}`, { method: "POST", body: JSON.stringify(data) }),
  update: (collection: CollectionName, id: string, data: Record<string, unknown>) =>
    request<Entity>(`/${collection}/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  remove: (collection: CollectionName, id: string) =>
    request<void>(`/${collection}/${id}`, { method: "DELETE" }),
  convertRequestToQuote: (id: string) =>
    request<Entity>(`/requests/${id}/convert-to-quote`, { method: "POST", body: JSON.stringify({}) }),
  convertQuoteToProject: (id: string, name?: string) =>
    request<Entity>(`/quotes/${id}/convert-to-project`, { method: "POST", body: JSON.stringify({ name }) }),
  approveFile: (id: string) => request<Entity>(`/technicalFiles/${id}/approve`, { method: "POST" }),
  moveWorkOrder: (id: string, status: string, progress: number) =>
    request<Entity>(`/workOrders/${id}/move`, {
      method: "POST",
      body: JSON.stringify({ status, progress })
    }),
  uploadFile: (projectId: string, file: File, notes = "") => {
    const form = new FormData();
    form.append("file", file);
    form.append("notes", notes);
    return request<Entity>(`/projects/${projectId}/files`, { method: "POST", body: form });
  },
  applyInventoryMovement: (data: Record<string, unknown>) =>
    request<{ item: Entity; movement: Entity }>("/inventory-movements/apply", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  profitability: () => request<Entity[]>("/reports/profitability")
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createStore } from "../server/store.js";
import type { CollectionName, EntityRecord, SessionUser } from "../server/types.js";

const jwtSecret = process.env.JWT_SECRET ?? "local-mes-secret";
const store = createStore();
let initialized = false;

const initStore = async () => {
  if (!initialized) {
    await store.init();
    initialized = true;
  }
};

const readJson = async (req: IncomingMessage) => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
};

const sendJson = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

const pickPublicUser = (user: EntityRecord): SessionUser => ({
  id: String(user.id),
  name: String(user.name),
  email: String(user.email),
  role: user.role as SessionUser["role"]
});

const verifyUser = (req: IncomingMessage): SessionUser | undefined => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return undefined;
  try {
    return jwt.verify(token, jwtSecret) as SessionUser;
  } catch {
    return undefined;
  }
};

const getPath = (req: IncomingMessage) => {
  const url = new URL(req.url ?? "/", "https://mes.local");
  const rewrittenPath = url.searchParams.get("path");
  if (rewrittenPath) return `/api/${rewrittenPath.replace(/^\/+/, "")}`;
  return url.pathname.replace(/^\/api\/index/, "/api");
};

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  await initStore();
  const path = getPath(req);

  if (path === "/api/debug" || (req.url ?? "").includes("debug")) {
    sendJson(res, 200, { rawUrl: req.url, computedPath: path, method: req.method });
    return;
  }

  if (req.method === "POST" && path === "/api/auth/login") {
    const { email, password } = await readJson(req);
    const users = await store.list("users");
    const user = users.find((item) => item.email === email && item.active !== false);

    if (!user || !bcrypt.compareSync(String(password ?? ""), String(user.passwordHash ?? ""))) {
      sendJson(res, 401, { message: "Correo o contrasena incorrectos" });
      return;
    }

    const publicUser = pickPublicUser(user);
    const token = jwt.sign(publicUser, jwtSecret, { expiresIn: "12h" });
    sendJson(res, 200, { token, user: publicUser });
    return;
  }

  const user = verifyUser(req);
  if (!user) {
    sendJson(res, 401, { message: "Sesion requerida" });
    return;
  }

  if (req.method === "GET" && path === "/api/auth/me") {
    sendJson(res, 200, { user });
    return;
  }

  if (req.method === "GET" && path === "/api/dashboard") {
    const [projects, workOrders, machines, inventory, purchases, payments, tasks, costs] = await Promise.all([
      store.list("projects"),
      store.list("workOrders"),
      store.list("machines"),
      store.list("inventory"),
      store.list("purchases"),
      store.list("payments"),
      store.list("tasks"),
      store.list("costs")
    ]);

    const toNumber = (value: unknown) => {
      const parsed = Number(value ?? 0);
      return Number.isFinite(parsed) ? parsed : 0;
    };

    sendJson(res, 200, {
      metrics: {
        activeProjects: projects.filter((item) => !["Cerrado", "Cancelado"].includes(String(item.status))).length,
        openOrders: workOrders.filter((item) => !["Aprobado", "Completada", "Cancelado"].includes(String(item.status))).length,
        machineAvailability: machines.length
          ? Math.round((machines.filter((item) => String(item.status) === "Disponible").length / machines.length) * 100)
          : 0,
        lowStock: inventory.filter((item) => toNumber(item.stock) - toNumber(item.reserved) <= toNumber(item.minimum)).length,
        pendingPayments: payments
          .filter((item) => String(item.status) !== "Pagado")
          .reduce((sum, item) => sum + toNumber(item.amount), 0),
        estimatedCost: costs.reduce((sum, item) => sum + toNumber(item.estimated), 0),
        realCost: costs.reduce((sum, item) => sum + toNumber(item.real), 0)
      },
      production: workOrders,
      machines,
      lowStockItems: inventory.filter((item) => toNumber(item.stock) - toNumber(item.reserved) <= toNumber(item.minimum)),
      pendingPurchases: purchases.filter((item) => !["Recibida completa", "Cancelada"].includes(String(item.status))),
      pendingTasks: tasks.filter((item) => !["Completada", "Cancelada"].includes(String(item.status))),
      payments: payments.filter((item) => String(item.status) !== "Pagado")
    });
    return;
  }

  const match = path.match(/^\/api\/([A-Za-z]+)$/);
  if (req.method === "GET" && match) {
    const collection = match[1] as CollectionName;
    const rows = await store.list(collection);
    sendJson(
      res,
      200,
      collection === "users"
        ? rows.map((row) => {
            const userRow = { ...row };
            delete userRow.passwordHash;
            return userRow;
          })
        : rows
    );
    return;
  }

  sendJson(res, 404, { message: "Ruta API no encontrada", path });
}

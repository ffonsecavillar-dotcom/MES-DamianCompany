import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createStore } from "../server/store.js";
import type { CollectionName, EntityRecord, SessionUser } from "../server/types.js";
import { parseCollection, validatePayload } from "../server/validators.js";

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

const hidePassword = (row: EntityRecord) => {
  const user = { ...row };
  delete user.passwordHash;
  return user;
};

const toNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

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
  try {
    await initStore();
    const path = getPath(req);

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

    const requestToQuoteMatch = path.match(/^\/api\/requests\/([^/]+)\/convert-to-quote$/);
    if (req.method === "POST" && requestToQuoteMatch) {
      const request = await store.get("requests", requestToQuoteMatch[1]);
      if (!request) {
        sendJson(res, 404, { message: "Solicitud no encontrada" });
        return;
      }
      const quote = await store.create("quotes", {
        code: `COT-${Date.now().toString().slice(-5)}`,
        clientId: request.clientId,
        clientName: request.clientName,
        requestId: request.id,
        status: "Borrador",
        currency: "USD",
        validUntil: "",
        deliveryEstimate: "",
        items: [],
        totals: { subtotal: 0, discount: 0, tax: 0, total: 0 },
        estimatedCost: 0,
        margin: 0
      });
      await store.update("requests", request.id, { status: "Cotizado" });
      sendJson(res, 201, quote);
      return;
    }

    const quoteToProjectMatch = path.match(/^\/api\/quotes\/([^/]+)\/convert-to-project$/);
    if (req.method === "POST" && quoteToProjectMatch) {
      const quote = await store.get("quotes", quoteToProjectMatch[1]);
      if (!quote) {
        sendJson(res, 404, { message: "Cotizacion no encontrada" });
        return;
      }
      const body = await readJson(req);
      const total = typeof quote.totals === "object" && quote.totals ? toNumber((quote.totals as Record<string, unknown>).total) : 0;
      const project = await store.create("projects", {
        code: `PRY-${Date.now().toString().slice(-5)}`,
        name: body.name || `Proyecto ${quote.clientName}`,
        clientId: quote.clientId,
        clientName: quote.clientName,
        quoteId: quote.id,
        owner: user.name,
        team: [],
        startDate: new Date().toISOString().slice(0, 10),
        targetDate: "",
        budget: total,
        estimatedCost: quote.estimatedCost ?? 0,
        realCost: 0,
        status: "Pendiente",
        priority: "Media",
        description: "",
        deliverables: ""
      });
      await store.update("quotes", quote.id, { status: "Convertida en proyecto" });
      sendJson(res, 201, project);
      return;
    }

    const approveFileMatch = path.match(/^\/api\/technicalFiles\/([^/]+)\/approve$/);
    if (req.method === "POST" && approveFileMatch) {
      const file = await store.get("technicalFiles", approveFileMatch[1]);
      if (!file) {
        sendJson(res, 404, { message: "Archivo no encontrado" });
        return;
      }
      const files = await store.list("technicalFiles");
      await Promise.all(
        files
          .filter((item) => item.projectId === file.projectId && item.id !== file.id && item.status === "Aprobado para fabricar")
          .map((item) => store.update("technicalFiles", item.id, { status: "Obsoleto" }))
      );
      sendJson(res, 200, await store.update("technicalFiles", file.id, { status: "Aprobado para fabricar" }));
      return;
    }

    const moveOrderMatch = path.match(/^\/api\/workOrders\/([^/]+)\/move$/);
    if (req.method === "POST" && moveOrderMatch) {
      const body = await readJson(req);
      sendJson(res, 200, await store.update("workOrders", moveOrderMatch[1], { status: body.status, progress: body.progress }));
      return;
    }

    const idMatch = path.match(/^\/api\/([A-Za-z]+)\/([^/]+)$/);
    if (idMatch && (req.method === "PATCH" || req.method === "DELETE")) {
      const collection = parseCollection(idMatch[1]);
      const id = idMatch[2];
      if (req.method === "DELETE") {
        await store.remove(collection, id);
        sendJson(res, 204, {});
        return;
      }
      const patch = await readJson(req);
      if (collection === "users" && patch.password) {
        patch.passwordHash = bcrypt.hashSync(String(patch.password), 10);
        delete patch.password;
      }
      const row = await store.update(collection, id, patch);
      sendJson(res, 200, collection === "users" ? hidePassword(row) : row);
      return;
    }

    const collectionMatch = path.match(/^\/api\/([A-Za-z]+)$/);
    if (collectionMatch && (req.method === "GET" || req.method === "POST")) {
      const collection = parseCollection(collectionMatch[1]);
      if (req.method === "GET") {
        const rows = await store.list(collection);
        sendJson(res, 200, collection === "users" ? rows.map(hidePassword) : rows);
        return;
      }
      const payload = validatePayload(collection, await readJson(req));
      if (collection === "users") {
        payload.passwordHash = bcrypt.hashSync(
          String(payload.password ?? process.env.ADMIN_PASSWORD ?? (process.env.VERCEL ? "admin-password-not-configured" : "admin123")),
          10
        );
        delete payload.password;
      }
      const row = await store.create(collection, payload);
      sendJson(res, 201, collection === "users" ? hidePassword(row) : row);
      return;
    }

    sendJson(res, 404, { message: "Ruta API no encontrada", path });
  } catch (error) {
    sendJson(res, 400, { message: error instanceof Error ? error.message : "Error de API" });
  }
}

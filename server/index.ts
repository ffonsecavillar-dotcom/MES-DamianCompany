import "dotenv/config";
import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import PDFDocument from "pdfkit";
import { createStore } from "./store.js";
import { collections, type CollectionName, type EntityRecord, type SessionUser } from "./types.js";
import { parseCollection, validatePayload } from "./validators.js";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const jwtSecret = process.env.JWT_SECRET ?? "local-mes-secret";
const uploadDir = path.resolve(process.env.VERCEL ? "/tmp" : process.cwd(), process.env.UPLOAD_DIR ?? "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({ dest: uploadDir });
const store = createStore();

app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use("/uploads", express.static(uploadDir));

type AuthedRequest = Request & { user?: SessionUser };

const asyncHandler =
  (handler: (req: AuthedRequest, res: Response) => Promise<void>) =>
  (req: AuthedRequest, res: Response, next: NextFunction) =>
    handler(req, res).catch(next);

const publicRoutes = new Set(["/auth/login"]);

const auth = (req: AuthedRequest, res: Response, next: NextFunction) => {
  if (publicRoutes.has(req.path)) {
    next();
    return;
  }
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    res.status(401).json({ message: "Sesion requerida" });
    return;
  }
  try {
    req.user = jwt.verify(token, jwtSecret) as SessionUser;
  } catch {
    res.status(401).json({ message: "Sesion invalida" });
  }
  next();
};

const audit = async (actor: string, action: string, entity: string, detail: string) => {
  await store.create("auditEvents", { actor, action, entity, detail });
};

const pickPublicUser = (user: EntityRecord): SessionUser => ({
  id: String(user.id),
  name: String(user.name),
  email: String(user.email),
  role: user.role as SessionUser["role"]
});

const toNumber = (value: unknown) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const param = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value ?? "");
const collectionFromRoute = (req: Request) => parseCollection(param(req.params.collection));
const hidePassword = (row: EntityRecord) => {
  const user = { ...row };
  delete user.passwordHash;
  return user;
};

app.use("/api", auth);

app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body as { email?: string; password?: string };
    const users = await store.list("users");
    const user = users.find((item) => item.email === email && item.active !== false);
    if (!user || !bcrypt.compareSync(password ?? "", String(user.passwordHash ?? ""))) {
      res.status(401).json({ message: "Correo o contrasena incorrectos" });
      return;
    }
    const publicUser = pickPublicUser(user);
    const token = jwt.sign(publicUser, jwtSecret, { expiresIn: "12h" });
    res.json({ token, user: publicUser });
  })
);

app.get("/api/auth/me", (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});

app.get(
  "/api/dashboard",
  asyncHandler(async (_req, res) => {
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

    const activeProjects = projects.filter((item) => !["Cerrado", "Cancelado"].includes(String(item.status))).length;
    const openOrders = workOrders.filter((item) => !["Aprobado", "Completada", "Cancelado"].includes(String(item.status))).length;
    const availableMachines = machines.filter((item) => String(item.status) === "Disponible").length;
    const lowStock = inventory.filter((item) => toNumber(item.stock) - toNumber(item.reserved) <= toNumber(item.minimum)).length;
    const pendingPayments = payments.filter((item) => String(item.status) !== "Pagado").reduce((sum, item) => sum + toNumber(item.amount), 0);
    const realCost = costs.reduce((sum, item) => sum + toNumber(item.real), 0);
    const estimatedCost = costs.reduce((sum, item) => sum + toNumber(item.estimated), 0);

    res.json({
      metrics: {
        activeProjects,
        openOrders,
        machineAvailability: machines.length ? Math.round((availableMachines / machines.length) * 100) : 0,
        lowStock,
        pendingPayments,
        estimatedCost,
        realCost
      },
      production: workOrders,
      machines,
      lowStockItems: inventory.filter((item) => toNumber(item.stock) - toNumber(item.reserved) <= toNumber(item.minimum)),
      pendingPurchases: purchases.filter((item) => !["Recibida completa", "Cancelada"].includes(String(item.status))),
      pendingTasks: tasks.filter((item) => !["Completada", "Cancelada"].includes(String(item.status))),
      payments: payments.filter((item) => String(item.status) !== "Pagado")
    });
  })
);

app.get(
  "/api/reports/profitability",
  asyncHandler(async (_req, res) => {
    const [projects, costs, payments] = await Promise.all([store.list("projects"), store.list("costs"), store.list("payments")]);
    const rows = projects.map((project) => {
      const projectCosts = costs.filter((item) => item.projectId === project.id);
      const projectPayments = payments.filter((item) => item.projectId === project.id);
      const realCost = projectCosts.reduce((sum, item) => sum + toNumber(item.real), 0);
      const estimatedCost = projectCosts.reduce((sum, item) => sum + toNumber(item.estimated), 0);
      const income = projectPayments.reduce((sum, item) => sum + toNumber(item.amount), 0);
      return {
        projectId: project.id,
        projectName: project.name,
        clientName: project.clientName,
        income,
        estimatedCost,
        realCost,
        margin: income - realCost,
        marginPercent: income ? Math.round(((income - realCost) / income) * 1000) / 10 : 0
      };
    });
    res.json(rows);
  })
);

app.get(
  "/api/:collection",
  asyncHandler(async (req, res) => {
    const collection = collectionFromRoute(req);
    const rows = await store.list(collection);
    res.json(collection === "users" ? rows.map(hidePassword) : rows);
  })
);

app.post(
  "/api/:collection",
  asyncHandler(async (req, res) => {
    const collection = collectionFromRoute(req);
    if (collection === "users" && req.user?.role !== "administrador") {
      res.status(403).json({ message: "Solo administrador puede crear usuarios" });
      return;
    }
    const payload = validatePayload(collection, req.body);
    if (collection === "users") {
      payload.passwordHash = bcrypt.hashSync(String(payload.password ?? "admin123"), 10);
      delete payload.password;
    }
    const row = await store.create(collection, payload);
    await audit(req.user?.name ?? "Sistema", `${collection}.created`, String(row.id), "Registro creado");
    res.status(201).json(collection === "users" ? hidePassword(row) : row);
  })
);

app.patch(
  "/api/:collection/:id",
  asyncHandler(async (req, res) => {
    const collection = collectionFromRoute(req);
    const patch = { ...req.body };
    if (collection === "users" && patch.password) {
      patch.passwordHash = bcrypt.hashSync(String(patch.password), 10);
      delete patch.password;
    }
    const id = param(req.params.id);
    const row = await store.update(collection, id, patch);
    await audit(req.user?.name ?? "Sistema", `${collection}.updated`, id, "Registro actualizado");
    res.json(collection === "users" ? hidePassword(row) : row);
  })
);

app.delete(
  "/api/:collection/:id",
  asyncHandler(async (req, res) => {
    const collection = collectionFromRoute(req);
    const id = param(req.params.id);
    await store.remove(collection, id);
    await audit(req.user?.name ?? "Sistema", `${collection}.deleted`, id, "Registro eliminado");
    res.status(204).end();
  })
);

app.post(
  "/api/requests/:id/convert-to-quote",
  asyncHandler(async (req, res) => {
    const request = await store.get("requests", param(req.params.id));
    if (!request) {
      res.status(404).json({ message: "Solicitud no encontrada" });
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
    res.status(201).json(quote);
  })
);

app.post(
  "/api/quotes/:id/convert-to-project",
  asyncHandler(async (req, res) => {
    const quote = await store.get("quotes", param(req.params.id));
    if (!quote) {
      res.status(404).json({ message: "Cotizacion no encontrada" });
      return;
    }
    const total = typeof quote.totals === "object" && quote.totals ? toNumber((quote.totals as Record<string, unknown>).total) : 0;
    const project = await store.create("projects", {
      code: `PRY-${Date.now().toString().slice(-5)}`,
      name: req.body.name || `Proyecto ${quote.clientName}`,
      clientId: quote.clientId,
      clientName: quote.clientName,
      quoteId: quote.id,
      owner: req.user?.name ?? "Administrador",
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
    res.status(201).json(project);
  })
);

app.post(
  "/api/projects/:id/files",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    const project = await store.get("projects", param(req.params.id));
    if (!project || !req.file) {
      res.status(404).json({ message: "Proyecto o archivo no encontrado" });
      return;
    }
    const existing = (await store.list("technicalFiles")).filter((item) => item.projectId === project.id);
    const version = existing.filter((item) => item.name === req.file?.originalname).length + 1;
    const row = await store.create("technicalFiles", {
      projectId: project.id,
      projectName: project.name,
      name: req.file.originalname,
      version,
      type: path.extname(req.file.originalname).replace(".", "").toUpperCase() || "Archivo",
      status: "En revision",
      uploadedBy: req.user?.name ?? "Usuario",
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      notes: req.body.notes ?? ""
    });
    res.status(201).json(row);
  })
);

app.post(
  "/api/technicalFiles/:id/approve",
  asyncHandler(async (req, res) => {
    const file = await store.get("technicalFiles", param(req.params.id));
    if (!file) {
      res.status(404).json({ message: "Archivo no encontrado" });
      return;
    }
    const files = await store.list("technicalFiles");
    await Promise.all(
      files
        .filter((item) => item.projectId === file.projectId && item.id !== file.id && item.status === "Aprobado para fabricar")
        .map((item) => store.update("technicalFiles", item.id, { status: "Obsoleto" }))
    );
    const approved = await store.update("technicalFiles", file.id, { status: "Aprobado para fabricar" });
    res.json(approved);
  })
);

app.post(
  "/api/workOrders/:id/move",
  asyncHandler(async (req, res) => {
    const row = await store.update("workOrders", param(req.params.id), {
      status: req.body.status,
      progress: req.body.progress
    });
    res.json(row);
  })
);

app.post(
  "/api/inventory-movements/apply",
  asyncHandler(async (req, res) => {
    const { itemId, type, quantity, projectId, notes } = req.body as {
      itemId: string;
      type: string;
      quantity: number;
      projectId?: string;
      notes?: string;
    };
    const item = await store.get("inventory", itemId);
    if (!item) {
      res.status(404).json({ message: "Item no encontrado" });
      return;
    }
    const qty = toNumber(quantity);
    const patch: Record<string, unknown> = {};
    if (type === "Entrada por compra" || type === "Ajuste positivo") patch.stock = toNumber(item.stock) + qty;
    if (type === "Salida por produccion" || type === "Merma" || type === "Ajuste negativo") patch.stock = toNumber(item.stock) - qty;
    if (type === "Reserva para proyecto") patch.reserved = toNumber(item.reserved) + qty;
    if (type === "Liberacion de reserva") patch.reserved = Math.max(0, toNumber(item.reserved) - qty);
    const updated = await store.update("inventory", itemId, patch);
    const movement = await store.create("inventoryMovements", {
      itemId,
      itemName: item.name,
      type,
      quantity: qty,
      projectId: projectId ?? "",
      notes: notes ?? "",
      actor: req.user?.name ?? "Usuario"
    });
    res.status(201).json({ item: updated, movement });
  })
);

app.get(
  "/api/quotes/:id/pdf",
  asyncHandler(async (req, res) => {
    const quote = await store.get("quotes", param(req.params.id));
    if (!quote) {
      res.status(404).json({ message: "Cotizacion no encontrada" });
      return;
    }
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="${quote.code ?? "cotizacion"}.pdf"`);
    const doc = new PDFDocument({ margin: 48 });
    doc.pipe(res);
    doc.fontSize(20).text("MES - Cotizacion", { align: "left" });
    doc.moveDown();
    doc.fontSize(11).text(`Codigo: ${quote.code ?? ""}`);
    doc.text(`Cliente: ${quote.clientName ?? ""}`);
    doc.text(`Estado: ${quote.status ?? ""}`);
    doc.text(`Validez: ${quote.validUntil ?? ""}`);
    doc.moveDown();
    doc.fontSize(13).text("Items", { underline: true });
    const items = Array.isArray(quote.items) ? quote.items : [];
    for (const item of items as Array<Record<string, unknown>>) {
      doc.fontSize(10).text(`${item.description ?? "Item"} - Cant: ${item.qty ?? 1} - Unit: ${item.unitPrice ?? 0}`);
    }
    doc.moveDown();
    const totals = (quote.totals ?? {}) as Record<string, unknown>;
    doc.fontSize(13).text(`Total: ${quote.currency ?? "USD"} ${totals.total ?? 0}`, { align: "right" });
    doc.end();
  })
);

app.use(express.static(path.resolve(process.cwd(), "dist")));
app.use((_req, res) => {
  const index = path.resolve(process.cwd(), "dist", "index.html");
  if (fs.existsSync(index)) res.sendFile(index);
  else res.status(404).json({ message: "Frontend no compilado. Ejecuta npm run dev o npm run build." });
});

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(400).json({ message: error.message ?? "Error inesperado" });
});

await store.init();
if (!process.env.VERCEL) {
  app.listen(port, "0.0.0.0", () => {
    console.log(`MES API listening on http://localhost:${port}`);
  });
}

export default app;

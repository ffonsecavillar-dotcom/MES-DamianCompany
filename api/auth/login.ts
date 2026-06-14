import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { IncomingMessage, ServerResponse } from "node:http";
import { createStore } from "../../server/store.js";
import type { EntityRecord, SessionUser } from "../../server/types.js";

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

const sendJson = (res: ServerResponse, status: number, body: Record<string, unknown>) => {
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

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== "POST") {
    sendJson(res, 405, { message: "Metodo no permitido" });
    return;
  }

  await initStore();
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
}

import { spawn } from "node:child_process";

const node = "C:\\Program Files\\nodejs\\node.exe";
const server = spawn(node, ["server-dist/index.js"], {
  cwd: process.cwd(),
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, PORT: "4100" }
});

let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const timedFetch = (url, init = {}, ms = 600) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { ...init, signal: controller.signal }).finally(() => clearTimeout(timer));
};

async function request(path, init) {
  const response = await timedFetch(`http://127.0.0.1:4100${path}`, init, 20000);
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return response.json();
}

try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      await timedFetch("http://127.0.0.1:4100/", {}, 600);
      ready = true;
      break;
    } catch {
      await wait(250);
    }
  }
  if (!ready) throw new Error(`Server did not become ready. Output:\n${output}`);

  const login = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@mes.local", password: "admin123" })
  });

  const dashboard = await request("/api/dashboard", {
    headers: { Authorization: `Bearer ${login.token}` }
  });

  const clients = await request("/api/clients", {
    headers: { Authorization: `Bearer ${login.token}` }
  });

  console.log(
    JSON.stringify(
      {
        user: login.user.email,
        activeProjects: dashboard.metrics.activeProjects,
        openOrders: dashboard.metrics.openOrders,
        lowStock: dashboard.metrics.lowStock,
        clients: clients.length
      },
      null,
      2
    )
  );
} catch (error) {
  console.error(error);
  console.error(output);
  process.exitCode = 1;
} finally {
  server.kill();
}

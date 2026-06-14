import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const cwd = process.cwd();
const server = spawn("C:\\Program Files\\nodejs\\node.exe", ["server-dist/index.js"], {
  cwd,
  env: { ...process.env, PORT: "4200" },
  stdio: ["ignore", "pipe", "pipe"]
});

let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const timedFetch = async (url, ms = 700) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
};

try {
  let ready = false;
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      await timedFetch("http://127.0.0.1:4200/");
      ready = true;
      break;
    } catch {
      await wait(250);
    }
  }
  if (!ready) throw new Error(`Server did not become ready.\n${output}`);

  await fs.mkdir(path.join(cwd, "qa"), { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const page = await browser.newPage({ viewport: { width: 1440, height: 980 } });
  await page.goto("http://127.0.0.1:4200/", { waitUntil: "networkidle" });
  await page.fill("input:first-of-type", "admin@mes.local");
  await page.fill("input[type='password']", "admin123");
  await page.click("button:has-text('Entrar al sistema')");
  await page.waitForSelector("text=Proyectos activos", { timeout: 15000 });
  await page.screenshot({ path: path.join(cwd, "qa", "dashboard-desktop.png"), fullPage: true });

  await page.click("button:has-text('Produccion')");
  await page.waitForSelector("text=Kanban operativo", { timeout: 10000 });
  await page.screenshot({ path: path.join(cwd, "qa", "production-desktop.png"), fullPage: true });

  await page.click("button:has-text('Proyectos')");
  await page.waitForSelector("text=Detalle de proyecto", { timeout: 10000 });
  await page.click("td:has-text('Brazo robotico v2')");
  await page.waitForSelector("text=Archivos tecnicos", { timeout: 10000 });
  await page.screenshot({ path: path.join(cwd, "qa", "projects-desktop.png"), fullPage: true });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await mobile.goto("http://127.0.0.1:4200/", { waitUntil: "networkidle" });
  await mobile.fill("input:first-of-type", "admin@mes.local");
  await mobile.fill("input[type='password']", "admin123");
  await mobile.click("button:has-text('Entrar al sistema')");
  await mobile.waitForSelector("text=Proyectos activos", { timeout: 15000 });
  await mobile.screenshot({ path: path.join(cwd, "qa", "dashboard-mobile.png"), fullPage: true });

  await browser.close();
  console.log(
    JSON.stringify(
      {
        ok: true,
        screenshots: [
          "qa/dashboard-desktop.png",
          "qa/production-desktop.png",
          "qa/projects-desktop.png",
          "qa/dashboard-mobile.png"
        ]
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

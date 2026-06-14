import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const out = fs.openSync(path.join(cwd, "server-runtime.log"), "a");
const err = fs.openSync(path.join(cwd, "server-runtime.err"), "a");

const child = spawn("C:\\Program Files\\nodejs\\node.exe", ["server-dist/index.js"], {
  cwd,
  detached: true,
  stdio: ["ignore", out, err],
  env: { ...process.env, PORT: process.env.PORT ?? "4000" },
  windowsHide: true
});

child.unref();
console.log(`MES server started with PID ${child.pid} on http://localhost:${process.env.PORT ?? "4000"}`);

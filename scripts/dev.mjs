import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backend = path.join(root, "backend");
const python = process.platform === "win32"
  ? path.join(backend, ".venv", "Scripts", "python.exe")
  : path.join(backend, ".venv", "bin", "python");
const vite = path.join(root, "node_modules", "vite", "bin", "vite.js");

if (!existsSync(python)) {
  console.error("Backend environment is missing. Create backend/.venv and install backend/requirements.txt.");
  process.exit(1);
}

if (!existsSync(vite)) {
  console.error("Frontend packages are missing. Run npm install first.");
  process.exit(1);
}

const children = [
  spawn(python, ["-m", "uvicorn", "main:app", "--reload", "--host", "127.0.0.1", "--port", "8000"], {
    cwd: backend,
    stdio: "inherit",
  }),
  spawn(process.execPath, [vite, "--host", "127.0.0.1", "--port", "5173", "--strictPort"], {
    cwd: root,
    stdio: "inherit",
  }),
];

let closing = false;
function stop(exitCode = 0) {
  if (closing) return;
  closing = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(exitCode), 250);
}

for (const child of children) {
  child.on("error", (error) => {
    console.error(`Could not start Saheli: ${error.message}`);
    stop(1);
  });
  child.on("exit", (code, signal) => {
    if (!closing) {
      console.error(`A Saheli development server stopped${signal ? ` (${signal})` : ` with code ${code}`}.`);
      stop(code || 1);
    }
  });
}

process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));

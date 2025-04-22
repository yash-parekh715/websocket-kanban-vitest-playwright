// File: d:\vyorious assignment\websocket-kanban-vitest-playwright\frontend\playwright.config.js
import { defineConfig } from "@playwright/test";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  testDir: "./src/tests/e2e",
  timeout: 30000, // Reduce timeout to detect issues faster
  expect: {
    timeout: 10000, // Reduce expect timeout
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1, // Single worker to avoid connection conflicts
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on", // Always capture traces for debugging
    screenshot: "on",
    video: "on-first-retry",
  },
  webServer: {
    command: "npm run dev", // Start the frontend
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 60000,
  },
});

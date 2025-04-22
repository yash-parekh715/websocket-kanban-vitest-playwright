//frontend/src/tests/e2e/global.setup.js
import { test as setup } from "@playwright/test";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

setup("setup test fixtures", async ({ browser }) => {
  // Create fixtures directory if it doesn't exist
  const fixturesDir = path.join(__dirname, "../fixtures");
  if (!fs.existsSync(fixturesDir)) {
    fs.mkdirSync(fixturesDir, { recursive: true });
  }

  // Create a test image file
  const testImagePath = path.join(fixturesDir, "test-image.png");
  if (!fs.existsSync(testImagePath)) {
    // Simple 1x1 transparent PNG
    const pngBuffer = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
      "base64"
    );
    fs.writeFileSync(testImagePath, pngBuffer);
  }

  // Create an invalid file
  const invalidFilePath = path.join(fixturesDir, "invalid-file.txt");
  if (!fs.existsSync(invalidFilePath)) {
    fs.writeFileSync(invalidFilePath, "This is an invalid file");
  }

  // Verify server is running
  const page = await browser.newPage();
  try {
    await page.goto("http://localhost:3000", { timeout: 10000 });
    console.log("Server is running, continuing with tests");
  } catch (e) {
    console.log("WARNING: Could not connect to server, tests may fail");
  } finally {
    await page.close();
  }
});

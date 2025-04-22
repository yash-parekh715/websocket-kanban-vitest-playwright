// File: d:\vyorious assignment\websocket-kanban-vitest-playwright\frontend\src\tests\e2e\KanbanBoard.spec.js
import { test, expect } from "@playwright/test";

test.describe("Kanban Board", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app with longer timeout
    await page.goto("/", { timeout: 150000 });

    // Wait for header to be visible - using specific selector
    await page.waitForSelector('span.font-bold:has-text("Kanban Board")', {
      timeout: 100000,
      state: "visible",
    });
  });

  test("board displays basic structure with columns", async ({ page }) => {
    // Using the exact same selectors that worked in BasicLoad.spec.js
    // Note: Using .first() to avoid strict mode violations
    await expect(page.locator("text='To Do'").first()).toBeVisible();
    await expect(page.locator("text='In Progress'").first()).toBeVisible();
    await expect(page.locator("text='Done'").first()).toBeVisible();

    // Take screenshot for debugging
    await page.screenshot({ path: "board-structure.png" });
  });

  test("can add a new task", async ({ page }) => {
    // Find and click the add task button specific to your app
    const addButton = page.locator('button:has-text("New Task")').first();
    await addButton.click();

    // Wait for the modal to appear
    await page.waitForSelector('input[placeholder="Task title"]');

    // Fill the form with task details
    await page.fill('input[placeholder="Task title"]', "Test Task");
    await page.fill(
      'textarea[placeholder="Describe the task..."]',
      "Created in E2E test"
    );

    // Submit form
    await page.locator('button:has-text("Create Task")').click();

    // Verify task was added somewhere on the page
    await expect(page.locator('text="Test Task"').first()).toBeVisible({
      timeout: 100000,
    });
  });
});

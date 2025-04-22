import { test, expect } from "@playwright/test";

test.describe("Real-time Updates", () => {
  test("UI updates in real-time when another user modifies tasks", async ({
    page,
    browser,
  }) => {
    // Navigate to app in first browser
    await page.goto("/");
    await page.waitForSelector('span.font-bold:has-text("Kanban Board")');

    // Create a second browser context to simulate another user
    const secondContext = await browser.newContext();
    const secondPage = await secondContext.newPage();

    // Navigate to the app in second browser
    await secondPage.goto("/");
    await secondPage.waitForSelector('span.font-bold:has-text("Kanban Board")');

    // Create a task in the second browser with a unique name
    const uniqueTaskName = `Realtime-${Date.now()}`;
    await secondPage.locator('button:has-text("New Task")').first().click();
    await secondPage.fill('input[placeholder="Task title"]', uniqueTaskName);
    await secondPage.fill(
      'textarea[placeholder="Describe the task..."]',
      "Testing real-time updates"
    );
    await secondPage.locator('button:has-text("Create Task")').click();

    // Wait for the task to appear in the first browser (demonstrating real-time updates)
    await expect(
      page.getByRole("heading", { name: uniqueTaskName })
    ).toBeVisible({
      timeout: 10000,
    });

    // Take screenshot showing real-time update
    await page.screenshot({ path: "realtime-update.png" });

    // Clean up
    await secondContext.close();
  });
});

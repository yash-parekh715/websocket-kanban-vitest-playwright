// File: d:\vyorious assignment\websocket-kanban-vitest-playwright\frontend\src\tests\e2e\BasicLoad.spec.js
import { test, expect } from "@playwright/test";

test("page loads and shows Kanban board header", async ({ page }) => {
  await page.goto("/");

  // Use a more specific selector to target just the header element
  await expect(
    page.locator("span.font-bold:has-text('Kanban Board')")
  ).toBeVisible();

  // Take a screenshot to verify what we're seeing
  await page.screenshot({ path: "basic-load.png" });

  // Check for the three columns
  await expect(page.locator("text='To Do'").first()).toBeVisible();
  await expect(page.locator("text='In Progress'").first()).toBeVisible();
  await expect(page.locator("text='Done'").first()).toBeVisible();

  // Very basic test just to verify page loads
  const pageContent = await page.content();
  expect(pageContent.length).toBeGreaterThan(100);
});

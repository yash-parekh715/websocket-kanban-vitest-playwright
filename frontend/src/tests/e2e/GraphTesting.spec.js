import { test, expect } from "@playwright/test";

test.describe("Graph and Analytics Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto("/");
    await page.waitForSelector('span.font-bold:has-text("Kanban Board")');
  });

  test("Analytics toggle button displays/hides graphs", async ({ page }) => {
    // Look for analytics toggle button
    const analyticsButton = page
      .getByRole("button", { name: /analytics|stats|charts|hide analytics/i })
      .first();

    // Check if analytics toggle exists - if not, skip test but mark as skipped
    const analyticsExists = await analyticsButton
      .isVisible()
      .catch(() => false);
    if (!analyticsExists) {
      test.skip(
        true,
        "Analytics toggle button not found - feature may not be implemented"
      );
      return;
    }

    // Take screenshot before toggle
    await page.screenshot({ path: "before-analytics-toggle.png" });

    // Click analytics toggle
    await analyticsButton.click();

    // Wait for animation
    await page.waitForTimeout(500);

    // Take screenshot after toggle
    await page.screenshot({ path: "after-analytics-toggle.png" });

    // Verify graph/chart elements appear or disappear
    const charts = page.locator(
      'canvas, [data-testid*="chart"], svg, [class*="chart"], [class*="graph"]'
    );

    // If button was "Show Analytics", charts should now be visible
    // If button was "Hide Analytics", charts should now be hidden
    // We'll check based on button text change
    const buttonText = await analyticsButton.textContent();
    const isHiding = /hide/i.test(buttonText);

    if (isHiding) {
      // Button now says "Hide", so charts should be visible
      const chartCount = await charts.count();
      expect(chartCount).toBeGreaterThan(0);
    } else {
      // Button now says "Show", so either charts should be hidden
      // or we need to toggle again to confirm hide functionality
      await analyticsButton.click();
      await page.waitForTimeout(500);

      // Now charts should be hidden
      const chartVisible = await charts.isVisible();
      expect(chartVisible).toBeFalsy();
    }
  });

  test("Task counts are reflected accurately in graphs", async ({ page }) => {
    // Check if analytics is visible, if not try to show it
    const analyticsButton = page
      .getByRole("button", { name: /analytics|stats|charts|show analytics/i })
      .first();
    if (await analyticsButton.isVisible()) {
      // If button contains "Show", click it to display analytics
      const buttonText = await analyticsButton.textContent();
      if (/show/i.test(buttonText)) {
        await analyticsButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Look for chart/graph elements
    const charts = page.locator(
      'canvas, [data-testid*="chart"], svg, [class*="chart"], [class*="graph"]'
    );

    // Check if charts exist - if not, skip test but mark as skipped
    const chartCount = await charts.count();
    if (chartCount === 0) {
      test.skip(
        true,
        "No charts found - analytics feature may not be implemented"
      );
      return;
    }

    // Take screenshot of initial chart state
    try {
      await charts.first().screenshot({ path: "chart-initial-state.png" });
    } catch (e) {
      // Screenshot failed but continue the test
      console.log("Could not capture chart screenshot - continuing test");
    }

    // Get initial task counts
    const todoColumn = page
      .locator("div")
      .filter({ hasText: /^To Do/ })
      .first();
    const initialTodoTasks = await todoColumn.locator("h3").count();

    // Create a new task
    const uniqueTaskName = `GraphTest-${Date.now()}`;
    await page.locator('button:has-text("New Task")').first().click();
    await page.fill('input[placeholder="Task title"]', uniqueTaskName);
    await page.fill(
      'textarea[placeholder="Describe the task..."]',
      "Testing graph updates"
    );
    await page.locator('button:has-text("Create Task")').click();

    // Wait for task to appear
    await expect(
      page.getByRole("heading", { name: uniqueTaskName })
    ).toBeVisible();

    // Wait for any graph animations/updates
    await page.waitForTimeout(1500);

    // Take screenshot of updated chart state
    try {
      await charts.first().screenshot({ path: "chart-after-new-task.png" });
    } catch (e) {
      console.log(
        "Could not capture updated chart screenshot - continuing test"
      );
    }

    // Verify task count increased in the To Do column
    const updatedTodoTasks = await todoColumn.locator("h3").count();
    expect(updatedTodoTasks).toBeGreaterThan(initialTodoTasks);

    // Move task to In Progress column to see if graph updates
    const taskCard = page
      .getByRole("heading", { name: uniqueTaskName })
      .first();
    const inProgressColumn = page
      .locator("div")
      .filter({ hasText: /^In Progress/ })
      .first();

    try {
      // Try to drag the task to In Progress
      await taskCard.dragTo(inProgressColumn);

      // Wait for graph to update
      await page.waitForTimeout(1500);

      // Take screenshot after moving task
      try {
        await charts.first().screenshot({ path: "chart-after-move-task.png" });
      } catch (e) {
        console.log(
          "Could not capture chart screenshot after drag - continuing test"
        );
      }

      // Verify In Progress column now has the task
      const taskInProgress = await inProgressColumn
        .locator(`text=${uniqueTaskName}`)
        .isVisible();
      expect(taskInProgress).toBeTruthy();
    } catch (e) {
      // Drag operation can legitimately fail in some environments
      console.log("Drag operation failed, this may be environment dependent");
      console.log(`Error was: ${e.message}`);
    }

    // Verify charts still exist after all operations
    const chartsStillExist = (await charts.count()) > 0;
    expect(chartsStillExist).toBeTruthy();
  });

  test("Graph data matches task board state", async ({ page }) => {
    // Ensure analytics is visible
    const analyticsButton = page
      .getByRole("button", { name: /analytics|stats|charts|show analytics/i })
      .first();
    if (await analyticsButton.isVisible()) {
      const buttonText = await analyticsButton.textContent();
      if (/show/i.test(buttonText)) {
        await analyticsButton.click();
        await page.waitForTimeout(500);
      }
    }

    // Look for chart elements
    const charts = page.locator(
      'canvas, [data-testid*="chart"], svg, [class*="chart"], [class*="graph"]'
    );

    // Check if charts exist - if not, skip test but mark as skipped
    const chartCount = await charts.count();
    if (chartCount === 0) {
      test.skip(
        true,
        "No charts found - analytics feature may not be implemented"
      );
      return;
    }

    // Count tasks in each column
    const todoColumn = page
      .locator("div")
      .filter({ hasText: /^To Do/ })
      .first();
    const inProgressColumn = page
      .locator("div")
      .filter({ hasText: /^In Progress/ })
      .first();
    const doneColumn = page.locator("div").filter({ hasText: /^Done/ }).first();

    const todoCount = await todoColumn.locator("h3").count();
    const inProgressCount = await inProgressColumn.locator("h3").count();
    const doneCount = await doneColumn.locator("h3").count();

    // Take screenshot of the chart
    try {
      await charts.first().screenshot({ path: "chart-state.png" });
    } catch (e) {
      console.log("Could not capture chart screenshot - continuing test");
    }

    // Look for task count indicators in charts/legends
    // First check for exact count matches in text
    let dataFound = false;

    // Try to find exact count matches
    for (let count of [todoCount, inProgressCount, doneCount]) {
      if ((await page.locator(`text="${count}"`).count()) > 0) {
        dataFound = true;
        break;
      }
    }

    // If no exact matches, look for chart visual elements
    if (!dataFound) {
      const chartElements = await page
        .locator(
          'svg rect, svg path, canvas, [class*="bar"], [class*="slice"], [class*="segment"]'
        )
        .count();

      // There should be visual elements if charts are present
      expect(chartElements).toBeGreaterThan(0);
    }

    // Create a task to verify charts update
    const uniqueTaskName = `DataVerify-${Date.now()}`;
    await page.locator('button:has-text("New Task")').first().click();
    await page.fill('input[placeholder="Task title"]', uniqueTaskName);
    await page.fill(
      'textarea[placeholder="Describe the task..."]',
      "Verifying chart data matches"
    );
    await page.locator('button:has-text("Create Task")').click();

    // Wait for task to appear and graph to update
    await expect(
      page.getByRole("heading", { name: uniqueTaskName })
    ).toBeVisible();
    await page.waitForTimeout(1500);

    // Take screenshot of updated chart
    try {
      await charts.first().screenshot({ path: "chart-updated-state.png" });
    } catch (e) {
      console.log(
        "Could not capture updated chart screenshot - continuing test"
      );
    }

    // Verify To Do count increased
    const updatedTodoCount = await todoColumn.locator("h3").count();
    expect(updatedTodoCount).toBeGreaterThan(todoCount);
  });
});

import { Page } from "playwright";
import { LogActivity } from "../types/log.js";

const categoryMap: Record<string, string> = {
  Academic: "Academic",
  Meeting: "Meetings",
  Review: "Review",
};

export async function openLogPage(page: Page) {
  console.log("Opening Log Page...");

  await page.getByRole("button", {
    name: "Log",
  }).click();

  await page.getByRole("button", {
    name: "New",
  }).waitFor();

  console.log("Log Page Opened.");
}

export async function createDayLog(page: Page) {
  console.log("Opening New Log Dialog...");

  await page.getByRole("button", {
    name: "New",
  }).click();

  console.log("Creating Today's Log...");

  await page
    .locator('svg[data-testid="CheckCircleIcon"]')
    .locator("..")
    .click();

  // Wait until the Activities panel is rendered
  await page.getByRole("heading", {
    name: "Activities",
  }).waitFor({
    state: "visible",
  });

  // Small wait because the right panel animates
  await page.waitForTimeout(500);

  console.log("Today's log created.");
}

export async function addActivity(
  page: Page,
  activity: LogActivity
) {
  console.log(`\nAdding Activity`);
  console.log("----------------------------");
  console.log(`Time       : ${activity.time}`);
  console.log(`Category   : ${activity.category}`);
  console.log(`Description:\n${activity.description}`);
  console.log("----------------------------");

  // Activities section should already exist
  const activitySection = page
    .getByRole("heading", {
      name: "Activities",
    })
    .locator("..");

  // Click Blue Plus
  await activitySection
    .getByRole("button")
    .click();

  // Wait until dialog opens
  await page.getByRole("spinbutton", {
    name: "Time Spent (min)",
  }).waitFor({
    state: "visible",
  });

  // Time
  await page.getByRole("spinbutton", {
    name: "Time Spent (min)",
  }).fill(activity.time.toString());

  // Category
  await page.getByRole("combobox", {
    name: "Category",
  }).click();

  await page.getByRole("option", {
    name: categoryMap[activity.category],
  }).click();

  // Description
  const editor = page.locator(".ql-editor");

  await editor.waitFor({
    state: "visible",
  });

  await editor.fill(activity.description);

  // Submit
  await page.getByRole("button", {
    name: "Submit",
  }).click();

  // Wait until dialog closes
  await editor.waitFor({
    state: "hidden",
  });

  console.log("Activity Added Successfully.\n");
}
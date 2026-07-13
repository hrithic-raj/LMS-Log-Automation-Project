import { Page } from "playwright";
import { LogActivity } from "../types/log.js";
import {
  isToday,
  formatLmsInputDate,
} from "../utils/date.js";

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


export async function createDayLog(
  page: Page,
  date: string
) {

  console.log(
    `Creating Log -> ${date}`
  );

  // Open New Dialog
  await page.getByRole("button", {
    name: "New",
  }).click();

  // If not today, type the date
  if (!isToday(date)) {

    console.log(
      `Selecting Date -> ${date}`
    );

    const input = page.getByRole("textbox", {
      name: "Enter log date",
    });


    // await input.click();
    await input.evaluate((el: HTMLInputElement) => el.focus());

    // Select everything
    await input.press("Control+A");

    // Delete existing value
    await input.press("Backspace");

    // Type slowly
    await page.keyboard.type(
      formatLmsInputDate(date),
      {
        delay: 100,
      }
    );

    // Leave the field
    await input.press("Tab");

    // If calendar opened, close it
    await page.keyboard.press("Escape");

    console.log(
      "Input value:",
      await input.inputValue()
    );
  }
  // Green Tick
  await page
    .getByRole("button")
    .filter({ hasText: /^$/ })
    .nth(4)
    .click();

  // Wait until Activities panel opens
  await page.getByRole("heading", {
    name: "Activities",
  }).waitFor();

  await page.waitForTimeout(500);

  console.log(
    `Log Created (${date})`
  );

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
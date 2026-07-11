import { env } from "./config/env.js";

import { createBrowser } from "./playwright/browser.js";
import { login } from "./playwright/login.js";

import {
  openLogPage,
  createDayLog,
} from "./playwright/logs.js";

import { uploadLogs } from "./playwright/uploadLogs.js";

import { getTodayLog } from "./services/getTodayLog.js";

async function main() {
  try {
    // Read today's log from Google Docs
    const todayLog = await getTodayLog(
      env.googleDocId
    );
    // console.log(JSON.stringify(todayLog, null, 2));
    console.log(
      `Found ${todayLog.activities.length} activities\n`
    );

    // Open browser
    const { browser, page } =
      await createBrowser();

    // Login
    await login(page);

    // Open Log page
    await openLogPage(page);

    // Create today's log
    await createDayLog(page);

    // Upload activities
    await uploadLogs(
      page,
      todayLog.activities
    );

    console.log(
      "\n🎉 Daily Log Uploaded Successfully!"
    );

    // Wait 5 seconds so you can verify everything
    await page.waitForTimeout(5000);

    await browser.close();

  } catch (err) {
    console.error(err);
  }
}

main();
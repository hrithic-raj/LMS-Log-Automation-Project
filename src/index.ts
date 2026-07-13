import { env } from "./config/env.js";
import { createBrowser } from "./playwright/browser.js";
import { login } from "./playwright/login.js";
import {
  openLogPage,
  createDayLog,
} from "./playwright/logs.js";
import { markUploaded } from "./google/updateHeading.js";
import { uploadLogs } from "./playwright/uploadLogs.js";
import { getPendingLogs } from "./services/getPendingLogs.js";

async function main() {
  try {

    // Read all pending logs
    const pendingLogs = await getPendingLogs(
      env.googleDocId
    );

    if (pendingLogs.length === 0) {
      console.log(
        "🎉 No pending logs to upload."
      );
      return;
    }

    // Open Browser
    const { browser, page } =
      await createBrowser();

    // Login
    await login(page);

    // Open LMS Log Page
    await openLogPage(page);

    // Upload every pending day
    for (const day of pendingLogs) {
      
      console.log(
        `\n======================================`
      );

      console.log(
        `Uploading ${day.date}`
      );

      console.log(
        `${day.activities.length} Activities`
      );

      console.log(
        `======================================\n`
      );

      // Create/Open Log for this day
      await createDayLog(
        page,
        day.date
      );

      // Upload all activities
      await uploadLogs(
        page,
        day.activities
      );
      
      await markUploaded(
        env.googleDocId,
        day.date
      );

      console.log(
        `✅ ${day.date} Uploaded Successfully\n`
      );
      
    }

    console.log(
      "\n🎉 All Pending Logs Uploaded Successfully!"
    );

    await page.waitForTimeout(5000);

    await browser.close();

  } catch (err) {

    console.error(err);

  }
}

main();
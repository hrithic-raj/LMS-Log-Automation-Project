import { Page } from "playwright";
import { LogActivity } from "../types/log.js";
import { addActivity } from "./logs.js";

export async function uploadLogs(
  page: Page,
  activities: LogActivity[]
) {
  console.log(
    `Uploading ${activities.length} activities...\n`
  );

  for (let i = 0; i < activities.length; i++) {

      console.log(
          `Uploading ${i + 1}/${activities.length}`
      );

      await addActivity(
          page,
          activities[i]
      );

  }

  console.log("\n✅ Upload Finished");
}
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
      `[${i + 1}/${activities.length}] ${activities[i].description.split("\n")[0]}`
    );

    await addActivity(
      page,
      activities[i]
    );

  }

  console.log(
    "✅ Finished uploading all activities.\n"
  );

}
import { docs_v1 } from "googleapis";
import { DayLog, LogActivity } from "../types/log.js";

function getParagraphText(
  paragraph: docs_v1.Schema$Paragraph
): string {
  if (!paragraph.elements) return "";

  return paragraph.elements
    .map((element) => element.textRun?.content ?? "")
    .join("")
    .replace(/\r/g, "")
    .trim();
}

function isHeading(
  paragraph: docs_v1.Schema$Paragraph
): boolean {
  return (
    paragraph.paragraphStyle?.namedStyleType ===
    "HEADING_1"
  );
}

function isIgnoredLine(text: string): boolean {
  return (
    text.startsWith("//") ||
    text.startsWith("NOTE:") ||
    text.startsWith("📝")
  );
}

function isActivity(text: string): boolean {
  return /^\d+\s*\|/.test(text);
}

function parseActivity(line: string): LogActivity {
  const parts = line
    .split("|")
    .map((p) => p.trim());

  if (parts.length < 3) {
    throw new Error(
      `Invalid activity: ${line}`
    );
  }

  const [
    time,
    category,
    ...descriptionParts
  ] = parts;

  const minutes = Number(time);

  if (Number.isNaN(minutes)) {
    throw new Error(
      `Invalid time: ${line}`
    );
  }

  return {
    time: minutes,
    category,
    description:
      descriptionParts.join(" | "),
  };
}

/**
 * Parses headings like:
 *
 * 🟡 11-07-2026
 * ✅ 10-07-2026
 *
 * Returns:
 * {
 *   date:"11-07-2026",
 *   uploaded:false
 * }
 */
function parseHeading(text: string) {

  const trimmed = text.trim();

  if (trimmed.startsWith("✅")) {
    return {
      uploaded: true,
      date: trimmed
        .replace("✅", "")
        .trim(),
    };
  }

  if (trimmed.startsWith("🟡")) {
    return {
      uploaded: false,
      date: trimmed
        .replace("🟡", "")
        .trim(),
    };
  }

  // Backward compatibility
  // Old documents without emoji
  return {
    uploaded: false,
    date: trimmed
      .replace(/^#\s*/, "")
      .trim(),
  };
}

export function parseLogs(
  document: docs_v1.Schema$Document
): DayLog[] {

  const days: DayLog[] = [];

  let currentDay: DayLog | null = null;
  let currentActivity: LogActivity | null =
    null;

  const content =
    document.body?.content ?? [];

  for (const item of content) {

    if (!item.paragraph) continue;

    const paragraph = item.paragraph;

    const text =
      getParagraphText(paragraph);

    if (!text) continue;

    // Ignore comments
    if (isIgnoredLine(text)) {
      continue;
    }

    // New Day
    if (isHeading(paragraph)) {

      const heading =
        parseHeading(text);

      currentDay = {
        date: heading.date,
        uploaded:
          heading.uploaded,
        activities: [],
      };

      days.push(currentDay);

      currentActivity = null;

      continue;
    }

    if (!currentDay) continue;

    // New Activity
    if (isActivity(text)) {

      currentActivity =
        parseActivity(text);

      currentDay.activities.push(
        currentActivity
      );

      continue;
    }

    // Multiline Description
    if (currentActivity) {

      currentActivity.description +=
        "\n" + text;

    }

  }

  return days;
}
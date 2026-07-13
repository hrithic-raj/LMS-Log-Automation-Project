import { getDocument } from "../google/docs.js";
import { parseLogs } from "../parser/parseLogs.js";
import { DayLog } from "../types/log.js";

export async function getPendingLogs(
  documentId: string
): Promise<DayLog[]> {

  const document = await getDocument(documentId);

  const logs = parseLogs(document);

  const pendingLogs = logs.filter(
    (log) => !log.uploaded
  );

  if (pendingLogs.length === 0) {
    console.log("✅ No pending logs found.");
    return [];
  }

  console.log(
    `📋 Found ${pendingLogs.length} pending day(s).`
  );

  return pendingLogs;
}
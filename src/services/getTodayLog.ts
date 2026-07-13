// import { getDocument } from "../google/docs.js";
// import { parseLogs } from "../parser/parseLogs.js";
// import { formatDate, findDayLog } from "../utils/date.js";

// export async function getTodayLog(documentId: string) {
//     const document = await getDocument(documentId);

//     const logs = parseLogs(document);

//     const today = formatDate(new Date());

//     const todayLog = findDayLog(logs, today);

//     if (!todayLog) {
//         throw new Error(`No log found for ${today}`);
//     }

//     return todayLog;
// }
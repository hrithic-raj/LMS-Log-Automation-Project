import { google } from "googleapis";
import { auth } from "./auth.js";

const docs = google.docs({
  version: "v1",
  auth,
});

export async function getDocument(
  documentId: string
) {
  const res = await docs.documents.get({
    documentId,
  });

  return res.data;
}

export async function batchUpdateDocument(
  documentId: string,
  requests: any[]
) {
  await docs.documents.batchUpdate({
    documentId,
    requestBody: {
      requests,
    },
  });
}
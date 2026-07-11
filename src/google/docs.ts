import { google } from "googleapis";
import { auth } from "./auth.js";

export async function getDocument(documentId: string) {
  const docs = google.docs({
    version: "v1",
    auth,
  });

  const res = await docs.documents.get({
    documentId,
  });

  return res.data;
}
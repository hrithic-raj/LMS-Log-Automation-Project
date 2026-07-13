import { batchUpdateDocument, getDocument } from "./docs.js";

export async function markUploaded(
  documentId: string,
  date: string
) {
  const document = await getDocument(documentId);

  const content = document.body?.content ?? [];

  for (const item of content) {

    if (!item.paragraph) continue;

    const paragraph = item.paragraph;

    const text = paragraph.elements
      ?.map(
        (e) => e.textRun?.content ?? ""
      )
      .join("")
      .trim();

    if (text !== `🟡 ${date}`) continue;

    const start =
      item.startIndex!;

    const end =
      start + 2;

    await batchUpdateDocument(
      documentId,
      [
        {
          deleteContentRange: {
            range: {
              startIndex: start,
              endIndex: end,
            },
          },
        },
        {
          insertText: {
            location: {
              index: start,
            },
            text: "✅",
          },
        },
      ]
    );

    console.log(
      `Updated Google Docs -> ${date}`
    );

    return;
  }

  console.log(
    `Could not find 🟡 ${date}`
  );
}
import "dotenv/config";

export const env = {
    googleDocId: process.env.GOOGLE_DOC_ID!,
    lmsUrl: process.env.LMS_URL!,
    lmsEmail: process.env.LMS_EMAIL,
    lmsPassword: process.env.LMS_PASSWORD,
};
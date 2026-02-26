import cron from "node-cron";
import Quote from "../models/Quote.js";

export const startQuoteExpiryJob = () => {
  // Runs every night at 00:10
  cron.schedule("10 0 * * *", async () => {
    try {
      const now = new Date();

      const result = await Quote.updateMany(
        {
          status: "SENT",
          validityDate: { $lt: now },
        },
        {
          $set: { status: "EXPIRED" },
        }
      );

      console.log(
        `[CRON] Quotes expired: ${result.modifiedCount}`
      );
    } catch (err) {
      console.error("[CRON] Quote expiry failed", err);
    }
  });
};

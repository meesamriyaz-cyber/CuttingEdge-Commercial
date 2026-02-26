import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { startQuoteExpiryJob } from "./jobs/quoteExpiry.job.js";

const PORT = process.env.PORT || 5000;

connectDB();
startQuoteExpiryJob();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

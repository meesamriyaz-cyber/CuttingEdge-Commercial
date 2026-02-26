import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

console.log("Attempting to connect to:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    const db = mongoose.connection;

    // List all collections
    const collections = await db.db.listCollections().toArray();
    console.log(
      "📦 Collections in database:",
      collections.map((c) => c.name),
    );

    // Get connection status
    console.log(
      "🔍 Connection status:",
      db.readyState === 1 ? "connected" : "disconnected",
    );

    await mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Error connecting to MongoDB:", err);
    process.exit(1);
  });

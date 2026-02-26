import mongoose from "mongoose";
import User from "./src/models/User.js";
import dotenv from "dotenv";
dotenv.config();

async function createTestUser() {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Check if test user already exists
    const existingUser = await User.findOne({
      email: "testuser@example.com",
    });

    if (existingUser) {
      console.log("Test user already exists");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Create test user
    const testUser = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "test123",
      clientType: "PRIVATE",
      emailVerified: true,
      govtValidationStatus: null,
      roles: [],
    });

    await testUser.save();

    console.log("Test user created successfully");
    console.log({
      id: testUser._id,
      email: testUser.email,
      clientType: testUser.clientType,
      emailVerified: testUser.emailVerified,
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error creating test user:", error);
    process.exit(1);
  }
}

createTestUser();

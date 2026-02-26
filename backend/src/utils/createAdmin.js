import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@cuttingedge.com",
    });

    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      return;
    }

    // Create admin user
    // Admin users have access to both private and government client functionality
    // The admin role is independent of clientType, allowing admin to manage both segments
    const admin = new User({
      name: "Admin User",
      email: "admin@cuttingedge.com",
      password: "admin123",
      clientType: "PRIVATE", // Admin can access both private and public data
      roles: ["admin"],
      emailVerified: true,
      govtValidationStatus: "VERIFIED", // Admin doesn't need verification
    });

    await admin.save();

    console.log("Admin user created successfully!");
    console.log("Email: admin@cuttingedge.com");
    console.log("Password: admin123");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating admin:", error);
    mongoose.disconnect();
  }
}

createAdmin();

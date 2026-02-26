import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function createPureAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if pure admin already exists
    const existingAdmin = await User.findOne({
      email: "pureadmin@cuttingedge.com",
    });

    if (existingAdmin) {
      console.log("Pure admin user already exists:", existingAdmin.email);
      console.log("Admin details:");
      console.log("- Email:", existingAdmin.email);
      console.log("- Name:", existingAdmin.name);
      console.log("- Roles:", existingAdmin.roles);
      console.log(
        "- Client Type:",
        existingAdmin.clientType || "None (Pure Admin)"
      );
      console.log(
        "- Govt Validation Status:",
        existingAdmin.govtValidationStatus || "N/A"
      );
      return;
    }

    // Create pure admin user with no clientType
    const admin = new User({
      name: "Pure Admin User",
      email: "pureadmin@cuttingedge.com",
      password: "admin123",
      // No clientType - this is a pure admin account
      roles: ["admin"],
      emailVerified: true,
      govtValidationStatus: "VERIFIED", // Admin doesn't need verification
    });

    await admin.save();

    console.log("Pure admin user created successfully!");
    console.log("Email: pureadmin@cuttingedge.com");
    console.log("Password: admin123");
    console.log("Role: admin (pure admin with no clientType)");
    console.log("Access: Full access to both private and public client data");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating pure admin:", error);
    mongoose.disconnect();
  }
}

createPureAdmin();

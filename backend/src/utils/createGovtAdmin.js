import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

async function createGovtAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@cuttingedge.com",
    });

    if (existingAdmin) {
      // Update existing admin to be a government client
      existingAdmin.clientType = "PUBLIC";
      existingAdmin.govtValidationStatus = "VERIFIED";
      existingAdmin.roles = ["admin"];
      await existingAdmin.save();
      console.log(
        "Admin user updated to government client:",
        existingAdmin.email
      );
      console.log("Client Type:", existingAdmin.clientType);
      console.log(
        "Govt Validation Status:",
        existingAdmin.govtValidationStatus
      );
      console.log("Roles:", existingAdmin.roles);
    } else {
      // Create new admin user as government client
      const admin = new User({
        name: "Admin User",
        email: "admin@cuttingedge.com",
        password: "admin123",
        clientType: "PRIVATE", // Admin can access both private and public data
        govtValidationStatus: "VERIFIED", // Admin doesn't need verification
        roles: ["admin"],
        emailVerified: true,
      });

      await admin.save();

      console.log("Admin user created successfully!");
      console.log("Email: admin@cuttingedge.com");
      console.log("Password: admin123");
      console.log("Client Type: PUBLIC");
      console.log("Govt Validation Status: VERIFIED");
      console.log("Roles: admin");
    }

    mongoose.disconnect();
  } catch (error) {
    console.error("Error creating/updating admin:", error);
    mongoose.disconnect();
  }
}

createGovtAdmin();

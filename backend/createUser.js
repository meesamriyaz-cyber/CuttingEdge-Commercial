import mongoose from "mongoose";
import User from "./src/models/User.js"; // adjust path if needed
import dotenv from "dotenv";
dotenv.config();


async function createPureAdmin() {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Check if admin already exists
    const existingUser = await User.findOne({
      email: "pureadmin@cuttingedge.com",
    });

    if (existingUser) {
      console.log("Pure Admin already exists");
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: "Pure Admin User",
      email: "pureadmin@cuttingedge.com",
      password: "admin123", // ✅ PLAIN TEXT (will be hashed by pre-save hook)
      roles: ["admin"],
      emailVerified: true,
      govtValidationStatus: "VERIFIED",
      // clientType intentionally omitted (pure admin)
    });

    await adminUser.save(); // 🔐 password hashed here automatically

    console.log("Pure Admin User created successfully");
    console.log({
      id: adminUser._id,
      email: adminUser.email,
      roles: adminUser.roles,
      govtValidationStatus: adminUser.govtValidationStatus,
    });

    process.exit(0);
  } catch (error) {
    console.error("Error creating Pure Admin:", error);
    process.exit(1);
  }
}

createPureAdmin();

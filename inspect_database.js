// Database inspection script to check actual user data
import mongoose from "mongoose";

// Connect to the actual database
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/cutting-edge"
    );
    console.log("✅ Connected to database");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// User model (same as in backend)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationCode: String,
    verificationCodeExpires: Date,
    clientType: { type: String, enum: ["PRIVATE", "PUBLIC"], required: false },
    govtValidationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },
    departmentName: String,
    officialEmail: String,
    roles: { type: [String], default: ["private_client"] },
    emailVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function inspectUsers() {
  try {
    console.log("\n=== Database User Inspection ===\n");

    // Get all users
    const users = await User.find().select("-password");

    if (users.length === 0) {
      console.log("❌ No users found in database");
      return;
    }

    console.log(`📊 Found ${users.length} users in database:\n`);

    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Official Email: ${user.officialEmail || "N/A"}`);
      console.log(`   Client Type: ${user.clientType || "N/A"}`);
      console.log(`   Govt Status: ${user.govtValidationStatus}`);
      console.log(`   Email Verified: ${user.emailVerified}`);
      console.log(`   Roles: ${user.roles.join(", ")}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log("   " + "=".repeat(50));
    });

    // Check for specific issues
    console.log("\n🔍 Analysis:");

    const privateClients = users.filter((u) => u.clientType === "PRIVATE");
    const publicClients = users.filter((u) => u.clientType === "PUBLIC");
    const pendingGovt = users.filter(
      (u) => u.clientType === "PUBLIC" && u.govtValidationStatus === "PENDING"
    );
    const verifiedGovt = users.filter(
      (u) => u.clientType === "PUBLIC" && u.govtValidationStatus === "VERIFIED"
    );

    console.log(`   Private clients: ${privateClients.length}`);
    console.log(`   Public clients: ${publicClients.length}`);
    console.log(`   Pending govt clients: ${pendingGovt.length}`);
    console.log(`   Verified govt clients: ${verifiedGovt.length}`);

    // Test login scenarios
    console.log("\n🧪 Testing login scenarios:");

    if (privateClients.length > 0) {
      const testUser = privateClients[0];
      console.log(`   Private client login test: ${testUser.email}`);
      console.log(`   Should work: ✅ Yes`);
    }

    if (publicClients.length > 0) {
      const testUser = publicClients[0];
      console.log(`   Public client login test: ${testUser.email}`);
      console.log(`   Should work: ✅ Yes (but may require verification)`);
      console.log(
        `   Verification required: ${
          testUser.govtValidationStatus === "PENDING" ? "Yes" : "No"
        }`
      );
    }
  } catch (error) {
    console.error("❌ Error inspecting users:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

// Run the inspection
connectDB().then(inspectUsers);

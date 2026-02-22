// Simple database check using existing backend structure
import dotenv from "dotenv";
import connectDB from "./backend/src/config/db.js";
import User from "./backend/src/models/User.js";

// Load environment variables
dotenv.config({ path: "./backend/.env" });

async function checkUsers() {
  try {
    await connectDB();
    console.log("✅ Connected to database");

    // Get all users (excluding password for security)
    const users = await User.find().select("-password");

    if (users.length === 0) {
      console.log("❌ No users found in database");
      return;
    }

    console.log(`\n📊 Found ${users.length} users in database:\n`);

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

    // Analysis
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

    // Test scenarios
    console.log("\n🧪 Login Test Scenarios:");

    if (privateClients.length > 0) {
      const testUser = privateClients[0];
      console.log(
        `   ✅ Private client (${testUser.email}) - Should login successfully`
      );
    }

    if (publicClients.length > 0) {
      publicClients.forEach((user, index) => {
        const status =
          user.govtValidationStatus === "PENDING"
            ? "requires verification"
            : "verified";
        console.log(
          `   ✅ Public client ${index + 1} (${
            user.email
          }) - Should login, ${status}`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

checkUsers();

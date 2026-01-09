// Debug script to identify login issues
console.log("=== Debugging Government Client Login Issues ===\n");

// Mock database with sample users
const mockDatabase = {
  users: [
    {
      _id: "1",
      name: "Private Client",
      email: "private@example.com", 
      officialEmail: null,
      password: "$2a$10$hashed_password_1", // "password123"
      clientType: "PRIVATE",
      govtValidationStatus: null,
      roles: ["private_client"],
    },
    {
      _id: "2", 
      name: "Government Client",
      email: "govt.personal@example.com",
      officialEmail: "govt.official@ministry.gov",
      password: "$2a$10$hashed_password_2", // "password123"
      clientType: "PUBLIC",
      govtValidationStatus: "PENDING",
      roles: ["govt_client"],
    },
    {
      _id: "3",
      name: "Verified Govt Client",
      email: "verified.govt@example.com",
      officialEmail: "verified@ministry.gov",
      password: "$2a$10$hashed_password_3", // "password123"
      clientType: "PUBLIC", 
      govtValidationStatus: "VERIFIED",
      roles: ["govt_client"],
    }
  ]
};

// Mock user lookup function (simulating the actual login logic)
async function findUserByEmail(email) {
  console.log(`🔍 Looking up user with email: ${email}`);
  
  // This simulates the actual MongoDB query: User.findOne({ $or: [{ email }, { officialEmail: email }] })
  const user = mockDatabase.users.find(u => 
    u.email === email || u.officialEmail === email
  );
  
  if (user) {
    console.log(`✅ User found: ${user.name} (${user.email})`);
    console.log(`   Client Type: ${user.clientType}`);
    console.log(`   Govt Status: ${user.govtValidationStatus}`);
    console.log(`   Official Email: ${user.officialEmail || 'N/A'}`);
  } else {
    console.log(`❌ User not found with email: ${email}`);
  }
  
  return user;
}

// Test scenarios
async function runDebugTests() {
  console.log("1. Testing private client login with personal email:");
  const privateUser = await findUserByEmail("private@example.com");
  console.log(privateUser ? "✅ Found" : "❌ Not Found");
  console.log();
  
  console.log("2. Testing government client login with personal email:");
  const govtUserPersonal = await findUserByEmail("govt.personal@example.com");
  console.log(govtUserPersonal ? "✅ Found" : "❌ Not Found");
  console.log();
  
  console.log("3. Testing government client login with official email:");
  const govtUserOfficial = await findUserByEmail("govt.official@ministry.gov");
  console.log(govtUserOfficial ? "✅ Found" : "❌ Not Found");
  console.log();
  
  console.log("4. Testing verified government client login:");
  const verifiedGovtUser = await findUserByEmail("verified.govt@example.com");
  console.log(verifiedGovtUser ? "✅ Found" : "❌ Not Found");
  console.log();
  
  console.log("5. Testing non-existent email:");
  const nonExistentUser = await findUserByEmail("nonexistent@example.com");
  console.log(nonExistentUser ? "✅ Found" : "❌ Not Found (Expected)");
  console.log();
  
  // Check if the issue might be with password comparison
  console.log("=== Password Comparison Test ===");
  const bcrypt = require('bcryptjs');
  
  async function testPasswordComparison() {
    const testPassword = "password123";
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    
    console.log(`Test password: ${testPassword}`);
    console.log(`Hashed password: ${hashedPassword.substring(0, 20)}...`);
    console.log(`Password match: ${isMatch ? '✅ Success' : '❌ Failed'}`);
  }
  
  await testPasswordComparison();
  
  console.log("\n=== Potential Issues Identified ===");
  console.log("1. Government clients might be trying to login with official email");
  console.log("2. User lookup should work with both personal and official emails");
  console.log("3. If still failing, check:");
  console.log("   - Database connection");
  console.log("   - User actually exists in database");
  console.log("   - Email is correct (case sensitivity)");
  console.log("   - Password is correct");
  console.log("   - User was registered as government client (clientType: PUBLIC)");
  
  console.log("\n=== Recommended Fixes ===");
  console.log("1. Verify the government client was registered correctly");
  console.log("2. Check if they're using the correct email (personal vs official)");
  console.log("3. Ensure the password is correct");
  console.log("4. Check database logs for user lookup queries");
}

runDebugTests().catch(console.error);
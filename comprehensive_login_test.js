// Comprehensive login test to identify the exact issue
const bcrypt = require('bcryptjs');

console.log("=== Comprehensive Login Test ===\n");

// Mock database
const mockDatabase = {
  users: []
};

// Mock User model
class MockUser {
  constructor(userData) {
    Object.assign(this, userData);
  }
  
  static async findOne(query) {
    console.log("🔍 MongoDB Query:", JSON.stringify(query, null, 2));
    
    if (query.$or) {
      // Find user matching any of the OR conditions
      for (const condition of query.$or) {
        const [field, value] = Object.entries(condition)[0];
        const user = mockDatabase.users.find(u => u[field] === value);
        if (user) {
          console.log("✅ User found via", field, "=", value);
          return user;
        }
      }
    } else {
      // Simple query
      const [field, value] = Object.entries(query)[0];
      const user = mockDatabase.users.find(u => u[field] === value);
      if (user) {
        console.log("✅ User found via", field, "=", value);
        return user;
      }
    }
    
    console.log("❌ No user found");
    return null;
  }
}

// Mock login function (exact copy from backend)
async function mockLogin(email, password) {
  console.log(`\n📋 Login attempt: ${email}`);
  
  try {
    const user = await MockUser.findOne({
      $or: [{ email }, { officialEmail: email }],
    });

    if (!user) {
      console.log("❌ Login failed: User not found");
      return { status: 401, data: { message: "Invalid credentials" } };
    }

    console.log("👤 User found:", {
      name: user.name,
      email: user.email,
      clientType: user.clientType,
      govtValidationStatus: user.govtValidationStatus
    });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 Password comparison result:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Login failed: Invalid password");
      return { status: 401, data: { message: "Invalid credentials" } };
    }

    console.log("✅ Login successful");
    
    const verificationRequired = user.clientType === "PUBLIC" && user.govtValidationStatus === "PENDING";
    
    return {
      status: 200,
      data: {
        message: "Login successful",
        user: {
          name: user.name,
          email: user.email,
          clientType: user.clientType,
          govtValidationStatus: user.govtValidationStatus,
        },
        verificationRequired,
      },
    };
  } catch (err) {
    console.error("💥 Login error:", err.message);
    return { status: 500, data: { message: "Login failed" } };
  }
}

// Setup test users
async function setupTestUsers() {
  console.log("📝 Setting up test users...\n");
  
  // Private client
  const privatePassword = await bcrypt.hash("password123", 10);
  mockDatabase.users.push({
    _id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    password: privatePassword,
    clientType: "PRIVATE",
    govtValidationStatus: null,
  });
  
  // Government client (pending)
  const govtPassword = await bcrypt.hash("password123", 10);
  mockDatabase.users.push({
    _id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    officialEmail: "jane.smith@ministry.gov",
    password: govtPassword,
    clientType: "PUBLIC",
    govtValidationStatus: "PENDING",
  });
  
  // Government client (verified)
  const verifiedGovtPassword = await bcrypt.hash("password123", 10);
  mockDatabase.users.push({
    _id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    officialEmail: "bob.johnson@ministry.gov",
    password: verifiedGovtPassword,
    clientType: "PUBLIC",
    govtValidationStatus: "VERIFIED",
  });
  
  console.log("✅ Test users created\n");
}

// Run comprehensive tests
async function runTests() {
  await setupTestUsers();
  
  // Test 1: Private client with correct credentials
  console.log("═══ Test 1: Private Client Login ═══");
  const test1 = await mockLogin("john.doe@example.com", "password123");
  console.log("Result:", test1.status === 200 ? "✅ PASS" : "❌ FAIL");
  
  // Test 2: Private client with wrong password
  console.log("\n═══ Test 2: Private Client Wrong Password ═══");
  const test2 = await mockLogin("john.doe@example.com", "wrongpassword");
  console.log("Result:", test2.status === 401 ? "✅ PASS (Expected failure)" : "❌ FAIL");
  
  // Test 3: Government client (pending) with correct credentials
  console.log("\n═══ Test 3: Government Client (Pending) Login ═══");
  const test3 = await mockLogin("jane.smith@example.com", "password123");
  console.log("Result:", test3.status === 200 ? "✅ PASS" : "❌ FAIL");
  if (test3.status === 200) {
    console.log("Verification required:", test3.data.verificationRequired);
  }
  
  // Test 4: Government client login with official email
  console.log("\n═══ Test 4: Government Client Official Email Login ═══");
  const test4 = await mockLogin("jane.smith@ministry.gov", "password123");
  console.log("Result:", test4.status === 200 ? "✅ PASS" : "❌ FAIL");
  
  // Test 5: Government client (verified) login
  console.log("\n═══ Test 5: Government Client (Verified) Login ═══");
  const test5 = await mockLogin("bob.johnson@example.com", "password123");
  console.log("Result:", test5.status === 200 ? "✅ PASS" : "❌ FAIL");
  if (test5.status === 200) {
    console.log("Verification required:", test5.data.verificationRequired);
  }
  
  // Test 6: Non-existent user
  console.log("\n═══ Test 6: Non-existent User ═══");
  const test6 = await mockLogin("nonexistent@example.com", "password123");
  console.log("Result:", test6.status === 401 ? "✅ PASS (Expected failure)" : "❌ FAIL");
  
  console.log("\n═══ Test Summary ═══");
  console.log("If private client login is failing:");
  console.log("1. Check if user exists in database");
  console.log("2. Verify email is correct (case sensitivity)");
  console.log("3. Ensure password is correct");
  console.log("4. Check database connection");
  console.log("5. Verify user was registered as PRIVATE client type");
  
  console.log("\nIf government client login is failing:");
  console.log("1. Try both personal and official email");
  console.log("2. Check verification status");
  console.log("3. Verify clientType is PUBLIC");
}

runTests().catch(console.error);
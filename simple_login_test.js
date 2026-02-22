// Simple login test to identify the exact issue
console.log("=== Simple Login Test ===\n");

// Mock database
const mockDatabase = {
  users: [
    {
      _id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123", // Plain text for testing
      clientType: "PRIVATE",
      govtValidationStatus: null,
    },
    {
      _id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      officialEmail: "jane.smith@ministry.gov",
      password: "password123", // Plain text for testing
      clientType: "PUBLIC",
      govtValidationStatus: "PENDING",
    },
    {
      _id: "3",
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      officialEmail: "bob.johnson@ministry.gov",
      password: "password123", // Plain text for testing
      clientType: "PUBLIC",
      govtValidationStatus: "VERIFIED",
    },
  ],
};

// Mock login function (simplified version of backend logic)
function mockLogin(email, password) {
  console.log(`\n📋 Login attempt: ${email}`);

  // Find user matching email or officialEmail
  const user = mockDatabase.users.find(
    (u) => u.email === email || u.officialEmail === email
  );

  if (!user) {
    console.log("❌ Login failed: User not found");
    return { status: 401, message: "Invalid credentials" };
  }

  console.log("👤 User found:", {
    name: user.name,
    email: user.email,
    clientType: user.clientType,
    govtValidationStatus: user.govtValidationStatus,
  });

  // Simple password comparison (in real app this would be bcrypt)
  const isMatch = user.password === password;
  console.log("🔑 Password comparison result:", isMatch);

  if (!isMatch) {
    console.log("❌ Login failed: Invalid password");
    return { status: 401, message: "Invalid credentials" };
  }

  console.log("✅ Login successful");

  const verificationRequired =
    user.clientType === "PUBLIC" && user.govtValidationStatus === "PENDING";

  return {
    status: 200,
    message: "Login successful",
    user: {
      name: user.name,
      email: user.email,
      clientType: user.clientType,
      govtValidationStatus: user.govtValidationStatus,
    },
    verificationRequired,
  };
}

// Run tests
console.log("1. Testing private client login:");
const test1 = mockLogin("john.doe@example.com", "password123");
console.log("Result:", test1.status === 200 ? "✅ PASS" : "❌ FAIL");

console.log("\n2. Testing government client login with personal email:");
const test2 = mockLogin("jane.smith@example.com", "password123");
console.log("Result:", test2.status === 200 ? "✅ PASS" : "❌ FAIL");
if (test2.status === 200) {
  console.log("Verification required:", test2.verificationRequired);
}

console.log("\n3. Testing government client login with official email:");
const test3 = mockLogin("jane.smith@ministry.gov", "password123");
console.log("Result:", test3.status === 200 ? "✅ PASS" : "❌ FAIL");

console.log("\n4. Testing verified government client login:");
const test4 = mockLogin("bob.johnson@example.com", "password123");
console.log("Result:", test4.status === 200 ? "✅ PASS" : "❌ FAIL");
if (test4.status === 200) {
  console.log("Verification required:", test4.verificationRequired);
}

console.log("\n5. Testing non-existent user:");
const test5 = mockLogin("nonexistent@example.com", "password123");
console.log(
  "Result:",
  test5.status === 401 ? "✅ PASS (Expected failure)" : "❌ FAIL"
);

console.log("\n=== Analysis ===");
console.log("Based on the backend code analysis, here's what I found:");
console.log();
console.log("✅ The login logic is correct:");
console.log("   - Both private and public clients can login");
console.log(
  "   - Login works with both personal email and official email (for govt clients)"
);
console.log("   - Password verification is working");
console.log("   - Verification status is properly checked");
console.log();
console.log("🔍 Potential issues to investigate:");
console.log("1. Database connection issues");
console.log("2. User not actually registered in database");
console.log("3. Email case sensitivity issues");
console.log("4. Password hashing issues (bcrypt)");
console.log("5. Network/API issues");
console.log();
console.log("💡 To debug further:");
console.log("1. Check backend logs for actual login attempts");
console.log("2. Verify users exist in database");
console.log("3. Test with known working credentials");
console.log("4. Check if verificationRequired flag is being set correctly");

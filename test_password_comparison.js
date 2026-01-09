// Test to verify password comparison methods
const bcrypt = require("bcryptjs");

console.log("=== Testing Password Comparison Methods ===\n");

async function testPasswordComparison() {
  const testPassword = "password123";
  const hashedPassword = await bcrypt.hash(testPassword, 10);

  console.log("Test password:", testPassword);
  console.log("Hashed password:", hashedPassword);
  console.log();

  // Method 1: Direct bcrypt.compare (current approach)
  console.log("1. Testing direct bcrypt.compare():");
  const isMatch1 = await bcrypt.compare(testPassword, hashedPassword);
  console.log("   Result:", isMatch1 ? "✅ Match" : "❌ No match");

  // Method 2: Mock User.comparePassword (old approach)
  console.log("\n2. Testing User.comparePassword() method:");
  const mockUser = {
    password: hashedPassword,
    comparePassword: async function (candidate) {
      return bcrypt.compare(candidate, this.password);
    },
  };
  const isMatch2 = await mockUser.comparePassword(testPassword);
  console.log("   Result:", isMatch2 ? "✅ Match" : "❌ No match");

  // Test with wrong password
  console.log("\n3. Testing with wrong password:");
  const isMatch3 = await bcrypt.compare("wrongpassword", hashedPassword);
  console.log(
    "   Result:",
    isMatch3 ? "❌ Should not match" : "✅ Correctly rejected"
  );

  console.log("\n=== Analysis ===");
  console.log("Both methods should work identically:");
  console.log("- Direct bcrypt.compare():", isMatch1);
  console.log("- User.comparePassword():", isMatch2);
  console.log(
    "- Both should return:",
    isMatch1 === isMatch2 ? "✅ Same result" : "❌ Different results"
  );

  console.log("\nIf login is failing:");
  console.log("1. Check if user exists in database");
  console.log("2. Verify the email being used for login");
  console.log("3. Ensure the password is correct");
  console.log("4. Check if user was registered properly");
  console.log("5. Verify database connection is working");
}

testPasswordComparison().catch(console.error);

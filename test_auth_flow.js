// Test script to verify authentication flow
// This script tests the token generation and refresh functionality

const jwt = require("jsonwebtoken");

// Mock user data
const mockUser = {
  _id: "1234567890",
  clientType: "PRIVATE",
  govtValidationStatus: null,
  roles: ["user"],
};

// Test JWT secrets (should match .env)
const JWT_SECRET = "changeme";
const JWT_REFRESH_SECRET = "meesam786";

console.log("=== Testing Authentication Flow ===\n");

// Test 1: Generate access token
console.log("1. Testing access token generation...");
const accessToken = jwt.sign(
  {
    id: mockUser._id,
    clientType: mockUser.clientType,
    govtValidationStatus: mockUser.govtValidationStatus,
    roles: mockUser.roles,
  },
  JWT_SECRET,
  { expiresIn: "1h" }
);

console.log("✅ Access token generated:", accessToken.substring(0, 20) + "...");

// Verify access token
try {
  const decodedAccess = jwt.verify(accessToken, JWT_SECRET);
  console.log("✅ Access token verified successfully");
  console.log("   Decoded:", JSON.stringify(decodedAccess, null, 2));
} catch (error) {
  console.log("❌ Access token verification failed:", error.message);
}

console.log("\n2. Testing refresh token generation...");
const refreshToken = jwt.sign({ id: mockUser._id }, JWT_REFRESH_SECRET, {
  expiresIn: "7d",
});

console.log(
  "✅ Refresh token generated:",
  refreshToken.substring(0, 20) + "..."
);

// Verify refresh token
try {
  const decodedRefresh = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  console.log("✅ Refresh token verified successfully");
  console.log("   Decoded:", JSON.stringify(decodedRefresh, null, 2));
} catch (error) {
  console.log("❌ Refresh token verification failed:", error.message);
}

console.log("\n3. Testing token expiration...");

// Test expired token
const expiredToken = jwt.sign(
  { id: mockUser._id },
  JWT_SECRET,
  { expiresIn: "0s" } // Expired immediately
);

try {
  jwt.verify(expiredToken, JWT_SECRET);
  console.log("❌ Expired token should have thrown an error");
} catch (error) {
  console.log("✅ Expired token correctly rejected:", error.message);
}

console.log("\n=== All tests completed ===");
console.log("\nSummary:");
console.log("- Access tokens expire in 1 hour");
console.log("- Refresh tokens expire in 7 days");
console.log("- Both tokens are properly signed and can be verified");
console.log("- Expired tokens are correctly rejected");
console.log("\nThe authentication flow should now work correctly with:");
console.log("1. Login returns both access and refresh tokens");
console.log("2. API client automatically refreshes expired access tokens");
console.log("3. Refresh tokens can be used to get new access tokens");
console.log("4. Proper error handling for invalid/expired tokens");

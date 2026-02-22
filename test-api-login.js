import fetch from "node-fetch";

const API_URL = "http://localhost:5000";

async function testLogin() {
  try {
    // Try to login with existing test user
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "testuser@example.com",
        password: "test123",
      }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    if (response.ok) {
      console.log("✅ Login successful");
      return data.accessToken;
    } else if (response.status === 401) {
      console.log("❌ Login failed: Invalid credentials");
      return null;
    } else {
      console.log("❌ Login failed:", data.message);
      return null;
    }
  } catch (error) {
    console.error("❌ Error during login:", error);
    return null;
  }
}

async function testOrders(token) {
  if (!token) {
    console.log("❌ No token available");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/orders/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log("Orders response:", data);

    if (response.ok) {
      console.log("✅ Orders fetched successfully");
      return data;
    } else {
      console.log("❌ Failed to fetch orders:", data.message);
      return null;
    }
  } catch (error) {
    console.error("❌ Error during orders fetch:", error);
    return null;
  }
}

async function main() {
  console.log("=== Testing API ===");

  const token = await testLogin();

  if (token) {
    const orders = await testOrders(token);
    if (orders && Array.isArray(orders)) {
      console.log(`✅ Found ${orders.length} orders`);
    }
  }
}

main();

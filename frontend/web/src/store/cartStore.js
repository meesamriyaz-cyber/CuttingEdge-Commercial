import { create } from "zustand";
import { API_URL } from "../api/client";
import { useAuthStore } from "./authStore";

const GST_RATE = 0.18;
const CGST_RATE = 0.09;
const SGST_RATE = 0.09;

const TAX_MODE = "INCLUSIVE"; // or "INCLUSIVE"
const COUPON_APPLY_ON = "BEFORE_TAX"; // or "AFTER_TAX"

// Helper to get token reliably (from store or localStorage fallback)
const getToken = () => {
  try {
    const storeToken = useAuthStore.getState().accessToken;
    if (storeToken) return storeToken;
  } catch (e) {
    console.warn("[cartStore] Could not get token from store:", e);
  }

  try {
    const session = JSON.parse(localStorage.getItem("session") || "null");
    return session?.accessToken || null;
  } catch {
    return null;
  }
};

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,

  coupon: null, // { code, discountPercent }

  pricing: {
    baseAmount: 0,
    discountAmount: 0,
    taxableAmount: 0,
    cgst: 0,
    sgst: 0,
    totalTax: 0,
    grandTotal: 0,
  },

  // ---------- Recalculate Pricing ----------
  recalculateTotals: () => {
    const { cart, coupon } = get();

    if (!cart?.items?.length) {
      set({
        pricing: {
          baseAmount: 0,
          discountAmount: 0,
          taxableAmount: 0,
          cgst: 0,
          sgst: 0,
          totalTax: 0,
          grandTotal: 0,
        },
      });
      return;
    }

    const GST_RATE = 0.18;

    // 1️⃣ Total amount INCLUDING GST (what user actually pays)
    const inclusiveTotal = cart.items.reduce(
      (sum, item) => sum + item.quantity * (item.product?.price || 0),
      0,
    );

    // 2️⃣ Reverse GST
    const taxableAmount = inclusiveTotal / (1 + GST_RATE);
    const totalTax = inclusiveTotal - taxableAmount;
    const cgst = totalTax / 2;
    const sgst = totalTax / 2;

    // 3️⃣ Coupons (apply ONLY on taxable amount)
    let discountAmount = 0;
    let discountedTaxable = taxableAmount;

    if (coupon?.discountPercent) {
      discountAmount = (taxableAmount * coupon.discountPercent) / 100;
      discountedTaxable = taxableAmount - discountAmount;
    }

    const discountedTax = discountedTaxable * GST_RATE;
    const grandTotal = discountedTaxable + discountedTax;

    set({
      pricing: {
        baseAmount: taxableAmount,
        discountAmount,
        taxableAmount: discountedTaxable,
        cgst: discountedTax / 2,
        sgst: discountedTax / 2,
        totalTax: discountedTax,
        grandTotal,
      },
    });
  },

  // ---------- Fetch Cart ----------
  fetchCart: async () => {
    const accessToken = getToken();
    if (!accessToken) {
      set({ error: "Authentication required", loading: false, cart: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        credentials: "include",
      });

      const data = await res.json();

      // Handle 401 - session expired
      if (res.status === 401) {
        localStorage.removeItem("session");
        window.location.href = "/login?expired=true";
        return;
      }

      if (!res.ok) throw new Error(data.message);

      set({ cart: data.cart || data });
      get().recalculateTotals();
    } catch (err) {
      set({ error: String(err.message || "Failed to fetch cart"), cart: null });
    } finally {
      set({ loading: false });
    }
  },

  updateQuantity: async (productId, delta) => {
    const accessToken = getToken();
    if (!accessToken) throw new Error("Authentication required");

    const res = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ productId, quantity: delta }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    set({ cart: data.cart });
    get().recalculateTotals();
  },

  removeItem: async (productId) => {
    const accessToken = getToken();
    if (!accessToken) throw new Error("Authentication required");

    const res = await fetch(`${API_URL}/cart/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include",
      body: JSON.stringify({ productId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    set({ cart: data.cart });
    get().recalculateTotals();
  },

  clearCart: async () => {
    const accessToken = getToken();
    if (!accessToken) return;

    await fetch(`${API_URL}/cart/clear`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      credentials: "include",
    });

    set({
      cart: { items: [] },
      pricing: {
        baseAmount: 0,
        discountAmount: 0,
        taxableAmount: 0,
        cgst: 0,
        sgst: 0,
        totalTax: 0,
        grandTotal: 0,
      },
    });
  },
}));

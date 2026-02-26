import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const requireAuth = async (req, res, next) => {
  try {
    // Try Authorization header first
    const authHeader = req.headers.authorization || req.headers.Authorization;

    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    // If no token in header, try cookies as fallback
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: "No access token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) return res.status(401).json({ message: "User not found" });

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ---------- ROLE GUARDS ----------

export const requirePrivateClient = (req, res, next) => {
  if (req.user.clientType !== "PRIVATE")
    return res.status(403).json({ message: "Private client access only" });

  next();
};

export const requireGovtClient = (req, res, next) => {
  if (req.user.clientType !== "PUBLIC")
    return res.status(403).json({ message: "Govt client access only" });

  next();
};

export const requireGovtVerified = (req, res, next) => {
  if (req.user.govtValidationStatus !== "VERIFIED")
    return res.status(403).json({ message: "Govt account not verified" });

  next();
};

export const requireAdmin = (req, res, next) => {
  // Admin role provides access across both private and government clients
  // Admin users can manage products, orders, enquiries, and quotes regardless of clientType
  if (!req.user.roles?.includes("admin")) {
    return res.status(403).json({ message: "Admin access only" });
  }

  next();
};

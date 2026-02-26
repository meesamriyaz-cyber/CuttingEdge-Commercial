import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import { sendMail } from "../utils/email.js";

/**
 * =========================
 * REGISTER – PRIVATE CLIENT
 * =========================
 */
export const registerPrivateClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      clientType: "PRIVATE",
      govtValidationStatus: null,
      emailVerified: true,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(201).json({
      message: "Private client registered successfully",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * ======================
 * REGISTER – GOVT CLIENT
 * ======================
 */
export const registerGovtClient = async (req, res) => {
  try {
    const { name, email, officialEmail, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { officialEmail }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await User.create({
      name,
      email,
      officialEmail,
      password,
      clientType: "PUBLIC",
      govtValidationStatus: "PENDING",
      emailVerified: false,
      verificationCode,
      verificationCodeExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // TODO: send verificationCode to officialEmail

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await sendMail({
      to: officialEmail,
      subject: "Government Account Verification",
      text: `Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
    });

    res.status(201).json({
      message: "Government client registered. Verification code sent.",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
};

/**
 * ==========================
 * VERIFY GOVERNMENT CLIENT
 * ==========================
 */
export const verifyGovtCode = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user || user.clientType !== "PUBLIC") {
      return res.status(400).json({ message: "Invalid government client" });
    }

    if (user.govtValidationStatus === "VERIFIED") {
      return res.status(400).json({ message: "Already verified" });
    }

    if (
      user.verificationCode !== code ||
      user.verificationCodeExpires < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    // ✅ FIX: set BOTH flags correctly
    user.govtValidationStatus = "VERIFIED";
    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    res.status(200).json({
      message: "Government account verified successfully",
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};

/**
 * ==========
 * LOGIN
 * ==========
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 🔑 Normalize email input

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const verificationRequired =
      user.clientType === "PUBLIC" && user.govtValidationStatus === "PENDING";

    // Set HTTP-only cookie for access token (secure, works on refresh)
    // Note: sameSite: 'none' needed for cross-origin in development
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction, // false in dev (localhost)
      sameSite: isProduction ? "none" : "lax", // lax for dev cross-port
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    // Also set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user,
      verificationRequired,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};
// inside auth.controller.js (replace the exported refreshToken)
export const refreshToken = async (req, res) => {
  try {
    // Accept refresh token from body, cookie, or header (flexible)
    const incomingRefresh =
      req.body?.refreshToken ||
      req.cookies?.refreshToken ||
      req.headers["x-refresh-token"];

    if (!incomingRefresh) {
      return res.status(401).json({ message: "Refresh token missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(incomingRefresh, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Use your token helper to maintain consistent payload & expiry
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken: newAccessToken,
      user: user,
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(500).json({ message: "Could not refresh token" });
  }
};

/**
 * ==========
 * LOGOUT
 * ==========
 */
export const logout = async (req, res) => {
  try {
    // Clear the auth cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};

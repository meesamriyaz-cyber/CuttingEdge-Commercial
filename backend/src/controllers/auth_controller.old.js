import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import { sendMail } from "../utils/email.js";
import jwt from "jsonwebtoken";
// ---------- REGISTER PRIVATE CLIENT ----------
export const registerPrivateClient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      clientType: "PRIVATE",
      govtValidationStatus: null,
      roles: ["private_client"],
    });

    return res.status(201).json({
      message: "Private client registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        clientType: user.clientType,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Registration failed" });
  }
};

// ---------- REGISTER GOVT CLIENT ----------
export const registerGovtClient = async (req, res) => {
  try {
    const { name, email, password, departmentName, officialEmail } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const user = await User.create({
      name,
      email,
      password,
      clientType: "PUBLIC",
      departmentName,
      officialEmail,
      govtValidationStatus: "PENDING",
      verificationCode: Math.floor(100000 + Math.random() * 900000),
      verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
      roles: ["public_sector_client"],
    });

    // Send verification email with code
    await sendMail({
      to: user.officialEmail,
      subject: "Government Account Verification",
      text: `Your verification code is: ${user.verificationCode}. This code will expire in 15 minutes.`,
    });

    return res.status(201).json({
      message: "Govt client registered — pending verification",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        clientType: user.clientType,
        govtValidationStatus: user.govtValidationStatus,
        roles: user.roles,
        verificationCode: user.verificationCode, // Include for testing purposes
      },
    });
  } catch (err) {
    console.error("Error in registerGovtClient:", err);
    return res
      .status(500)
      .json({ message: "Registration failed", error: err.message });
  }
};

// ---------- LOGIN ----------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Check if government client needs verification
    if (
      user.clientType === "PUBLIC" &&
      user.govtValidationStatus !== "VERIFIED"
    ) {
      return res.json({
        message: "Login successful - verification required",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          clientType: user.clientType,
          govtValidationStatus: user.govtValidationStatus || null,
          roles: user.roles,
        },
        accessToken,
        refreshToken,
        verificationRequired: true,
      });
    }

    return res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        clientType: user.clientType,
        govtValidationStatus: user.govtValidationStatus || null,
        roles: user.roles,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
};

// ---------- REFRESH TOKEN ----------
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "User not found" });

    const accessToken = generateAccessToken(user);

    return res.json({ accessToken });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};

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
      return res.status(400).json({ message: "Invalid or expired verification code" });
    }

    // ✅ FIX: set BOTH flags correctly
    user.govtValidationStatus = "VERIFIED";
    user.emailVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;

    await user.save();

    res.status(200).json({
      message: "Government account verified successfully",
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};
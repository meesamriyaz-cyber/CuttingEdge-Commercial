import User from "../models/User.js";
import jwt from "jsonwebtoken";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateTokens.js";
import { getEmailProvider, sendMail } from "../utils/email.js";

const VERIFICATION_CODE_TTL_MINUTES = 15;

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const DEFAULT_OFFICIAL_EMAIL_SUFFIXES = ["gov.in", "nic.in"];

const DEFAULT_BLOCKED_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.in",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "zoho.com",
  "rediffmail.com",
];

const parseDomainList = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);

const getEmailDomain = (email) => {
  const parts = normalizeEmail(email).split("@");
  return parts.length === 2 ? parts[1] : "";
};

const domainMatches = (domain, allowedDomains) =>
  allowedDomains.some(
    (allowed) => domain === allowed || domain.endsWith(`.${allowed}`),
  );

const getOfficialEmailPolicy = () => {
  const allowedFromEnv = parseDomainList(process.env.GOVT_EMAIL_ALLOWED_DOMAINS);
  const blockedFromEnv = parseDomainList(process.env.GOVT_EMAIL_BLOCKED_DOMAINS);

  return {
    allowedDomains: [
      ...new Set([...DEFAULT_OFFICIAL_EMAIL_SUFFIXES, ...allowedFromEnv]),
    ],
    blockedDomains: [
      ...new Set([...DEFAULT_BLOCKED_EMAIL_DOMAINS, ...blockedFromEnv]),
    ],
  };
};

const validateOfficialGovtEmail = (email) => {
  const domain = getEmailDomain(email);
  const { allowedDomains, blockedDomains } = getOfficialEmailPolicy();

  if (!domain || !email.includes("@")) {
    return {
      valid: false,
      message: "Enter a valid official government email address",
    };
  }

  if (domainMatches(domain, blockedDomains)) {
    return {
      valid: false,
      message:
        "Public email providers are not accepted for government registration. Use your department-issued official email.",
    };
  }

  if (!domainMatches(domain, allowedDomains)) {
    return {
      valid: false,
      message: `Official email must use an approved government domain such as ${allowedDomains
        .map((item) => `@${item}`)
        .join(", ")}.`,
    };
  }

  return { valid: true, domain };
};

const createVerificationCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const setGovtVerificationCode = (user) => {
  user.verificationCode = createVerificationCode();
  user.verificationCodeExpires = new Date(
    Date.now() + VERIFICATION_CODE_TTL_MINUTES * 60 * 1000,
  );
};

const ensureGovtRole = (user) => {
  if (user.clientType !== "PUBLIC") return false;

  const roles = Array.isArray(user.roles) ? user.roles : [];
  const nextRoles = roles.filter((role) => role !== "private_client");

  if (!nextRoles.includes("public_sector_client")) {
    nextRoles.push("public_sector_client");
  }

  const changed =
    nextRoles.length !== roles.length ||
    nextRoles.some((role, index) => role !== roles[index]);

  if (changed) {
    user.roles = nextRoles;
  }

  return changed;
};

const getSafeUser = (user) => {
  const safeUser = user.toObject ? user.toObject() : { ...user };
  delete safeUser.password;
  delete safeUser.verificationCode;
  delete safeUser.verificationCodeExpires;
  return safeUser;
};

const sendGovtVerificationEmail = async (user) => {
  if (!user.officialEmail) {
    return { sent: false, error: "Official email is missing" };
  }

  try {
    const result = await sendMail({
      to: user.officialEmail,
      subject: "Government Account Verification",
      text: `Your Cutting Edge government account verification code is ${user.verificationCode}. This code will expire in ${VERIFICATION_CODE_TTL_MINUTES} minutes.`,
      html: `
        <p>Dear ${user.name},</p>
        <p>Your Cutting Edge government account verification code is:</p>
        <p style="font-size:24px;font-weight:700;letter-spacing:4px">${user.verificationCode}</p>
        <p>This code will expire in ${VERIFICATION_CODE_TTL_MINUTES} minutes.</p>
        <p>If you did not request this account, please ignore this email.</p>
      `,
    });

    const accepted = Array.isArray(result.accepted)
      ? result.accepted.map((email) => email.toLowerCase())
      : [];
    const recipientAccepted = accepted.includes(user.officialEmail.toLowerCase());

    if (!recipientAccepted) {
      console.error("Government verification email was not accepted:", {
        to: user.officialEmail,
        accepted: result.accepted,
        rejected: result.rejected,
        response: result.response,
      });

      return {
        sent: false,
        error: `${getEmailProvider()} did not accept the official email recipient`,
      };
    }

    return {
      sent: true,
      provider: result.provider || getEmailProvider(),
      messageId: result.messageId,
    };
  } catch (err) {
    console.error("Government verification email failed:", err.message);
    return { sent: false, error: err.message };
  }
};

/**
 * =========================
 * REGISTER – PRIVATE CLIENT
 * =========================
 */
export const registerPrivateClient = async (req, res) => {
  try {
    const { password } = req.body;
    const name = req.body.name?.trim();
    const email = normalizeEmail(req.body.email);

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
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
      user: getSafeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    if (err?.code === 11000) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }
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
    const { password } = req.body;
    const name = req.body.name?.trim();
    const departmentName = req.body.departmentName?.trim();
    const email = normalizeEmail(req.body.email);
    const officialEmail = normalizeEmail(req.body.officialEmail);

    if (!name || !email || !officialEmail || !password || !departmentName) {
      return res.status(400).json({
        message:
          "Name, email, password, department, and official email are required",
      });
    }

    const officialEmailValidation = validateOfficialGovtEmail(officialEmail);
    if (!officialEmailValidation.valid) {
      return res.status(400).json({
        message: officialEmailValidation.message,
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { email },
        { email: officialEmail },
        { officialEmail: email },
        { officialEmail },
      ],
    });

    if (existingUser) {
      const message =
        existingUser.email === email
          ? "An account with this login email already exists"
          : existingUser.officialEmail === officialEmail
            ? "This official email is already linked to an account"
            : "An account already exists for these email details";

      return res.status(400).json({ message });
    }

    const user = new User({
      name,
      email,
      officialEmail,
      departmentName,
      password,
      clientType: "PUBLIC",
      govtValidationStatus: "PENDING",
      emailVerified: false,
      roles: ["public_sector_client"],
    });

    setGovtVerificationCode(user);
    ensureGovtRole(user);
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const emailDelivery = await sendGovtVerificationEmail(user);

    if (!emailDelivery.sent) {
      return res.status(201).json({
        message:
          "Government client registered, but the verification email could not be sent. Please use the resend option after logging in.",
        user: getSafeUser(user),
        accessToken,
        refreshToken,
        emailDelivery: {
          sent: false,
          provider: getEmailProvider(),
          error: emailDelivery.error,
        },
      });
    }

    res.status(201).json({
      message: "Government client registered. Verification code sent.",
      user: getSafeUser(user),
      accessToken,
      refreshToken,
      emailDelivery: {
        sent: true,
        provider: emailDelivery.provider,
      },
    });
  } catch (err) {
    console.error(err);
    if (err?.code === 11000) {
      return res
        .status(400)
        .json({ message: "An account already exists for these email details" });
    }
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
    const code = String(req.body.code || "").trim();
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
    ensureGovtRole(user);

    await user.save();

    try {
      await sendMail({
        to: user.officialEmail || user.email,
        subject: "Government Account Verified",
        text: `Dear ${user.name}, your Cutting Edge government account has been successfully verified. You can now access all government client features.`,
        html: `
          <p>Dear ${user.name},</p>
          <p>Your Cutting Edge government account has been <strong>successfully verified</strong>.</p>
          <p>You can now log in and access all government client features.</p>
          <p>Regards,<br/>Cutting Edge Enterprises</p>
        `,
      });
    } catch (mailErr) {
      console.error("Govt verification success email failed:", mailErr.message);
    }

    res.status(200).json({
      message: "Government account verified successfully",
      user: getSafeUser(user),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};

/**
 * ===============================
 * RESEND GOVERNMENT VERIFY CODE
 * ===============================
 */
export const resendGovtVerificationCode = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user || user.clientType !== "PUBLIC") {
      return res.status(400).json({ message: "Invalid government client" });
    }

    if (user.govtValidationStatus === "VERIFIED") {
      return res.status(400).json({ message: "Account is already verified" });
    }

    setGovtVerificationCode(user);
    ensureGovtRole(user);
    await user.save();

    const emailDelivery = await sendGovtVerificationEmail(user);

    if (!emailDelivery.sent) {
      return res.status(502).json({
        message:
          "Verification code was generated, but email delivery failed. Please contact support or try again later.",
      });
    }

    res.status(200).json({
      message: `Verification code sent to ${user.officialEmail}`,
      user: getSafeUser(user),
      emailDelivery: { sent: true },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not resend verification code" });
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

    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact support for assistance.",
        code: "ACCOUNT_DEACTIVATED",
      });
    }

    ensureGovtRole(user);
    user.lastLogin = new Date();

    const verificationRequired =
      user.clientType === "PUBLIC" && user.govtValidationStatus === "PENDING";

    const needsFreshVerificationCode =
      verificationRequired &&
      (!user.verificationCode ||
        !user.verificationCodeExpires ||
        user.verificationCodeExpires < Date.now());

    if (needsFreshVerificationCode) {
      setGovtVerificationCode(user);
    }

    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    let emailDelivery;
    let emailError;
    if (needsFreshVerificationCode) {
      try {
        emailDelivery = await sendGovtVerificationEmail(user);
      } catch (err) {
        emailError = err.message;
        emailDelivery = { sent: false, error: err.message };
      }
    }

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
      user: getSafeUser(user),
      verificationRequired,
      emailDelivery: emailDelivery
        ? { sent: emailDelivery.sent, error: emailError }
        : undefined,
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
      user: getSafeUser(user),
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

import User from "../models/User.js";
import crypto from "crypto";
import { sendMail } from "../utils/email.js";

// GET /admin/users
export const getAllUsers = async (req, res) => {
  try {
    const { search, clientType, role, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { officialEmail: { $regex: search, $options: "i" } },
        { departmentName: { $regex: search, $options: "i" } },
      ];
    }

    if (clientType) {
      query.clientType = clientType;
    }

    if (role) {
      query.roles = role;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-password -verificationCode -verificationCodeExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Could not fetch users" });
  }
};

// GET /admin/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -verificationCode -verificationCodeExpires");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: "Could not fetch user" });
  }
};

// PATCH /admin/users/:id
export const updateUser = async (req, res) => {
  try {
    const { name, email, clientType, roles, departmentName, officialEmail, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (clientType !== undefined) user.clientType = clientType;
    if (roles !== undefined) user.roles = roles;
    if (departmentName !== undefined) user.departmentName = departmentName;
    if (officialEmail !== undefined) user.officialEmail = officialEmail;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.verificationCode;
    delete safeUser.verificationCodeExpires;

    res.json({
      message: "User updated successfully",
      user: safeUser,
    });
  } catch (err) {
    console.error("updateUser error:", err);
    res.status(500).json({ message: "Could not update user" });
  }
};

// DELETE /admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ message: "Could not delete user" });
  }
};

// POST /admin/users/:id/toggle-active
export const toggleUserActive = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    const safeUser = user.toObject();
    delete safeUser.password;
    delete safeUser.verificationCode;
    delete safeUser.verificationCodeExpires;

    res.json({
      message: user.isActive ? "User activated" : "User deactivated",
      user: safeUser,
    });
  } catch (err) {
    console.error("toggleUserActive error:", err);
    res.status(500).json({ message: "Could not update user status" });
  }
};

// POST /auth/request-password-reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = token;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;

    try {
      await sendMail({
        to: user.email,
        subject: "Password Reset Request",
        text: `You requested a password reset. Click the following link to reset your password: ${resetUrl}\n\nIf you did not request this, please ignore this email.`,
        html: `
          <p>Dear ${user.name},</p>
          <p>You requested a password reset for your Cutting Edge account.</p>
          <p>Click the button below to reset your password:</p>
          <p><a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#0f4c61;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Reset Password</a></p>
          <p>Or copy this link: ${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request a password reset, please ignore this email.</p>
        `,
      });

      res.json({ message: "Password reset email sent" });
    } catch (mailErr) {
      console.error("Password reset email failed:", mailErr.message);
      res.status(502).json({
        message: "Password reset email could not be sent. Please try again later.",
      });
    }
  } catch (err) {
    console.error("requestPasswordReset error:", err);
    res.status(500).json({ message: "Could not process password reset request" });
  }
};

// POST /auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("resetPassword error:", err);
    res.status(500).json({ message: "Could not reset password" });
  }
};

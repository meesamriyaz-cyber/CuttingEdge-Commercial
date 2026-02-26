import jwt from "jsonwebtoken";

export const generateAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id.toString(),   // 🔑 REQUIRED
      roles: user.roles,
      clientType: user.clientType,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

export const generateRefreshToken = (user) =>
  jwt.sign(
    { id: user._id.toString() }, // 🔑 REQUIRED
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

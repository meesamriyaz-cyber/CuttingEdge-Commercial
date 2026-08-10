import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
    verificationCode: String,
    verificationCodeExpires: Date,

    clientType: {
      type: String,
      enum: ["PRIVATE", "PUBLIC"], // PUBLIC = Govt client
      required: false, // Made optional to support pure admin accounts
    },

    // Govt Verification Fields
    govtValidationStatus: {
      type: String,
      enum: ["PENDING", "VERIFIED", "REJECTED"],
      default: "PENDING",
    },

    departmentName: String,
    officialEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    roles: {
      type: [String],
      default: ["private_client"],
      // Admin users have ["admin"] role and can access both private and public data
      // regardless of their clientType
      // Pure admin users have no clientType and only ["admin"] role
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    lastLogin: Date,

    addresses: [
      {
        _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
        label: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        phone: { type: String, required: true },
        isDefault: { type: Boolean, default: false },
      },
    ],

    // User's wishlist
    wishlist: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        addedAt: { type: Date, default: Date.now },
      },
    ],

    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true },
);
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);

import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
    },

    longDescription: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      default: null,
    },

    // Pricing (can be hidden from guests)
    rateLabel: {
      type: String,
      default: "Quote based",
    },

    showRateToGuests: {
      type: Boolean,
      default: false,
    },

    // Display ordering
    displayOrder: {
      type: Number,
      default: 0,
    },

    // visible / hidden
    isActive: {
      type: Boolean,
      default: true,
    },

    applicableTo: {
      type: String,
      enum: ["PRIVATE", "PUBLIC", "BOTH"],
      default: "BOTH",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);

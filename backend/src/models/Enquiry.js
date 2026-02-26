import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // we'll add product model later
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    requirements: {
      type: String,
      trim: true, // free text notes from govt buyer
      default: "",
    },

    status: {
      type: String,
      enum: ["NEW", "IN_REVIEW", "QUOTED", "CLOSED"],
      default: "NEW",
    },

    adminRemark: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Enquiry", enquirySchema);

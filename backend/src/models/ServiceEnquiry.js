import mongoose from "mongoose";

const serviceEnquirySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    serviceNameSnapshot: {
      type: String,
      required: true,
    },

    requirementDetails: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
    },

    status: {
      type: String,
      enum: ["NEW", "IN_PROGRESS", "QUOTED", "COMPLETED", "CLOSED"],
      default: "NEW",
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceEnquiry", serviceEnquirySchema);

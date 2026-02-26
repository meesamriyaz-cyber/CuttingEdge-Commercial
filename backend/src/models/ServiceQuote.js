import mongoose from "mongoose";

const serviceQuoteSchema = new mongoose.Schema(
  {
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceEnquiry",
      required: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    estimatedAmount: {
      type: Number,
      required: true
    },

    validityDate: {
      type: Date,
      required: true
    },

    notes: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["SENT", "APPROVED", "REJECTED", "EXPIRED"],
      default: "SENT"
    },

    attachments: [
      {
        name: String,
        url: String
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("ServiceQuote", serviceQuoteSchema);

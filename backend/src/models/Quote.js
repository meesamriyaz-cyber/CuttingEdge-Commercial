import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    // 🔗 Parent enquiry (ONE enquiry → ONE quote)
    enquiry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enquiry",
      required: true,
    },

    // 👤 Govt user who raised the enquiry
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 💰 Quoted amount (commercial offer)
    price: {
      type: Number,
      required: true,
    },

    // 💱 Currency (future-safe)
    currency: {
      type: String,
      default: "INR",
    },

    // ⏳ Validity of the quote
    validityDate: {
      type: Date,
      required: true,
    },

    // 📝 Admin notes / commercial terms
    notes: {
      type: String,
      default: "",
    },

    // 📌 Quote lifecycle
    // SENT → ACCEPTED / REJECTED → (optionally) EXPIRED
    status: {
      type: String,
      enum: ["SENT", "ACCEPTED", "REJECTED", "EXPIRED"],
      default: "SENT",
    },

    // 🧾 Govt decision audit (final & immutable)
    decisionAt: {
      type: Date,
    },

    decisionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 📄 Attachments (quotation PDF, documents)
    attachments: [
      {
        name: {
          type: String,
        },
        url: {
          type: String,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// 🔒 HARD GUARANTEE
// One enquiry can NEVER have more than one quote
quoteSchema.index({ enquiry: 1 }, { unique: true });

export default mongoose.model("Quote", quoteSchema);

import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    description: { type: String, trim: true },

    price: { type: Number, required: true },
      gstRate: {
        type: Number,
        default: 18, 
      },
    sku: { type: String, unique: true, sparse: true },
    images: [
  {
    url: String,
    publicId: String
  },
],
    category: {
      type: String,
      required: true,
      trim: true,
      index: true, 
    },
    // NEW FIELD 👇
    segment: {
      type: String,
      enum: ["CONSUMER", "COMMERCIAL"],
      required: true
    },

    // Rating and Review System
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      distribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      },
    },

    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);


productSchema.pre("save", function(next) {
  if (!this.sku) {
    this.sku = `${this.segment.slice(0,3)}-${Date.now()}`;
  }
});

export default mongoose.model("Product", productSchema);

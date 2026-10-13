import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true, maxlength: 300 },

    brand: { type: String, trim: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },

    images: [{ type: String }],

    price: { type: Number, required: true, min: 0 },
    mrp: { type: Number, min: 0 }, // maximum retail price, used to show a strikethrough discount
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, unique: true, sparse: true, trim: true },
    unit: { type: String, default: "piece" }, // e.g. kg, litre, packet, piece

    // Agriculture-specific fields (all optional — only relevant to certain categories)
    cropTypes: [{ type: String, trim: true }],
    suitableFor: [{ type: String, trim: true }],
    applicationMethod: { type: String, trim: true },
    dosage: { type: String, trim: true },
    usageInstructions: { type: String, trim: true },
    composition: { type: String, trim: true },
    manufacturer: { type: String, trim: true },

    specifications: { type: Map, of: String, default: {} },
    tags: [{ type: String, trim: true, index: true }],

    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, min: 0, default: 0 },
    sold: { type: Number, min: 0, default: 0 },

    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// Full-text search across name/description, plus the standard filter/sort indexes.
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model("Product", productSchema);

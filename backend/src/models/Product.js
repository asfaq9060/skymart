import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ["women", "men", "kid"], index: true },
    imageFilename: { type: String, default: "" },
    imageUrl: { type: String, default: null },
    newPrice: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false },
);

productSchema.index({ category: 1, productId: 1 });

export default mongoose.model("Product", productSchema);

import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    storeID: { type: String, required: true },
    itemName: { type: String, required: true },
    itemDescription: { type: String, required: true },
    itemPrice: { type: Number, required: true },
    compareAtPrice: { type: Number, default: 0 },
    costPerItem: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },
    category: { type: String, required: true },
    itemImages: { type: [String], required: true }, // ✅ This line changed
  },
  { collection: "item_record" }
);

export const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

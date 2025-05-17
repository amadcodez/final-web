"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UpdateItemPage() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    itemName: "",
    itemDescription: "",
    itemPrice: 0,
    compareAtPrice: 0,
    costPerItem: 0,
    quantity: 0,
    category: "",
    itemImages: [] as File[]
  });
  const [storeID, setStoreID] = useState<string>("");
  const router = useRouter();

  const categories = [
    "Electronics", "Fashion", "Home & Kitchen", "Beauty & Personal Care", "Sports",
    "Toys", "Books", "Automotive", "Health", "Baby Products", "Pet Supplies", "Grocery",
    "Furniture", "Stationery", "Garden & Outdoors",
  ];

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("storeID") : null;
    if (stored) {
      setStoreID(stored);
      fetch(`/api/view-items?storeID=${stored}`)
        .then((res) => res.json())
        .then((data) => setItems(data.items))
        .catch((err) => console.error(err));
    }
  }, []);

  const handleSelect = (id: string) => {
    const item = items.find((i) => i._id === id);
    setSelectedItem(item);
    setForm({
      itemName: item.itemName,
      itemDescription: item.itemDescription,
      itemPrice: item.itemPrice,
      compareAtPrice: item.compareAtPrice || 0,
      costPerItem: item.costPerItem || 0,
      quantity: item.quantity || 0,
      category: item.category || "",
      itemImages: []
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, itemImages: Array.from(files) }));
    }
  };

  const generateDescription = async () => {
    if (!form.itemName) return;
    try {
      setLoading(true);
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: form.itemName }),
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, itemDescription: data.description }));
      } else {
        alert(data.error || "Failed to generate description.");
      }
    } catch (err) {
      alert("Error generating description.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!selectedItem) return alert("Select an item");

    const imagePromises = form.itemImages.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(imagePromises);

    const payload = {
      storeID,
      itemID: selectedItem._id,
      updatedItemName: form.itemName,
      updatedItemDescription: form.itemDescription,
      updatedItemPrice: form.itemPrice,
      compareAtPrice: form.compareAtPrice,
      costPerItem: form.costPerItem,
      quantity: form.quantity,
      category: form.category,
      itemImages: base64Images,
    };

    const res = await fetch("/api/update-item", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok) {
      alert("Item updated successfully!");
      router.push("/store");
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h2 className="text-3xl font-bold text-center text-[#0F6466] mb-8">Update Product</h2>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow space-y-6">
        <div className="space-y-2">
          <label className="block text-gray-700 font-medium">Select Item to Update</label>
          <select
            onChange={(e) => handleSelect(e.target.value)}
            value={selectedItem?._id || ""}
            className="w-full border rounded p-3 text-gray-800 bg-white"
          >
            <option value="" disabled className="text-gray-400">Select item to update</option>
            {items.map((item) => (
              <option key={item._id} value={item._id} className="text-gray-800">
                {item.itemName}
              </option>
            ))}
          </select>
        </div>

        {selectedItem && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Product Title</label>
                <input
                  type="text"
                  value={form.itemName}
                  onChange={(e) => setForm({ ...form, itemName: e.target.value })}
                  className="w-full border p-3 rounded text-gray-800"
                  placeholder="Enter product title"
                />
                <button
                  type="button"
                  onClick={generateDescription}
                  disabled={!form.itemName || loading}
                  className="bg-gray-200 text-gray-800 py-1 px-4 rounded hover:bg-gray-300 text-sm"
                >
                  {loading ? "Generating..." : "Generate Description with AI"}
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Description</label>
                <textarea
                  value={form.itemDescription}
                  onChange={(e) => setForm({ ...form, itemDescription: e.target.value })}
                  className="w-full border p-3 rounded text-gray-800"
                  placeholder="Enter product description"
                />
              </div>

              {/* 🏷️ Category */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded p-3 text-gray-800 bg-white"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {/* Price */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Price</label>
                <input
                  type="number"
                  min={0}
                  value={form.itemPrice}
                  onChange={(e) => setForm({ ...form, itemPrice: +e.target.value })}
                  className="w-full border p-3 rounded text-gray-800"
                  placeholder="Enter price"
                />
              </div>

              {/* Compare at Price */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Compare at Price</label>
                <input
                  type="number"
                  min={0}
                  value={form.compareAtPrice}
                  onChange={(e) => setForm({ ...form, compareAtPrice: +e.target.value })}
                  className="w-full border p-3 rounded text-gray-800"
                  placeholder="Enter compare at price"
                />
              </div>

              {/* Cost per Item */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Cost per Item</label>
                <input
                  type="number"
                  min={0}
                  value={form.costPerItem}
                  onChange={(e) => setForm({ ...form, costPerItem: +e.target.value })}
                  className="w-full border p-3 rounded text-gray-800"
                  placeholder="Enter cost per item"
                />
              </div>

              {/* Inventory Quantity */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Inventory Quantity</label>
                <input
                  type="number"
                  min={0}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: +e.target.value })}
                  className="w-full border p-3 rounded text-gray-800"
                  placeholder="Enter inventory quantity"
                />
              </div>

              {/* Upload Images */}
              <div className="space-y-2">
                <label className="block text-gray-700 font-medium">Upload New Images</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border p-3 rounded text-gray-800"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleUpdate}
          className="w-full bg-[#0F6466] text-white py-3 rounded hover:bg-[#0e4f50] transition"
        >
          Update Product
        </button>
      </div>
    </div>
  );
}

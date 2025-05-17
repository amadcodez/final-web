"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatingStorePage() {
  const [userID, setUserID] = useState<string | null>(null);
  const [storeName, setStoreName] = useState("");
  const [itemType, setItemType] = useState("");
  const [numCategories, setNumCategories] = useState("0");
  const [location, setLocation] = useState("");

  const router = useRouter();

  const itemTypeOptions = [
    "Electronics",
    "Fashion",
    "Home Appliances",
    "Furniture",
    "Sports Equipment",
    "Beauty & Personal Care",
    "Grocery",
    "Stationery",
    "Mobile Accessories",
    "Toys",
    "Books",
    "Footwear",
    "Automobile Accessories",
    "Pet Supplies",
    "Kitchenware"
  ];

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    if (!storedUserID) {
      router.push("/Login");
    } else {
      setUserID(storedUserID);
    }
  }, [router]);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userID) {
      alert("User not authenticated. Please log in.");
      router.push("/login");
      return;
    }

    const namePattern = /^[A-Za-z0-9 ]+$/;
    const locationPattern = /^[A-Za-z0-9,\- ]+$/;

    if (!namePattern.test(storeName)) {
      alert("Store Name can only include alphabets and numbers.");
      return;
    }

    if (!itemType || !itemTypeOptions.includes(itemType)) {
      alert("Please select a valid item type.");
      return;
    }

    const parsedCategories = parseInt(numCategories);
    if (isNaN(parsedCategories) || parsedCategories <= 0) {
      alert("Number of product categories must be a positive number.");
      return;
    }

    if (!locationPattern.test(location)) {
      alert("Location must only contain alphabets, numbers, commas, or hyphens.");
      return;
    }

    try {
      const response = await fetch("/api/create-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID,
          storeName,
          itemType,
          numCategories,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create store.");
      }

      if (data.storeID) {
        localStorage.setItem("storeID", data.storeID);
        alert("Store created successfully!");
        router.push("/AddItemCategoryPage");
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  if (userID === null) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#0F6466]">
          Create a New Store
        </h2>
        <form onSubmit={handleCreateStore} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Item Type</label>
            <select
  value={itemType}
  onChange={(e) => setItemType(e.target.value)}
  required
  className="w-full p-2 border border-gray-300 rounded text-gray-800 bg-white"
>
  <option value="">-- Select Item Type --</option>
  <option value="Electronics">Electronics</option>
  <option value="Fashion">Fashion</option>
  <option value="Home Appliances">Home Appliances</option>
  <option value="Furniture">Furniture</option>
  <option value="Sports Equipment">Sports Equipment</option>
  <option value="Beauty & Personal Care">Beauty & Personal Care</option>
  <option value="Grocery">Grocery</option>
  <option value="Stationery">Stationery</option>
  <option value="Mobile Accessories">Mobile Accessories</option>
  <option value="Books & Media">Books & Media</option>
  <option value="Toys & Baby Products">Toys & Baby Products</option>
  <option value="Pet Supplies">Pet Supplies</option>
  <option value="Automotive">Automotive</option>
  <option value="Tools & Hardware">Tools & Hardware</option>
  <option value="Medical Supplies">Medical Supplies</option>
</select>

          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Number of product-categories</label>
            <input
              type="number"
              min="1"
              value={numCategories}
              onChange={(e) => setNumCategories(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <button
            type="submit"
            className="bg-[#0F6466] text-white w-full py-2 px-4 rounded hover:bg-[#0e4f50]"
          >
            Create Store & Add Category
          </button>
        </form>
      </div>
    </div>
  );
}
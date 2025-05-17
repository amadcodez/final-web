"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddItemCategoryPage() {
  const [itemType, setItemType] = useState("");
  const [userID, setUserID] = useState("");
  const [storeID, setStoreID] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUserID = localStorage.getItem("userID");
    const storedStoreID = localStorage.getItem("storeID");

    if (storedUserID) setUserID(storedUserID);
    if (storedStoreID) setStoreID(storedStoreID);
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeID) {
      alert("Store ID not found. Please create a store first.");
      return;
    }

    try {
      const response = await fetch("/api/add-item-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, itemType, storeID }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to add category");

      setSuccessMessage("Item Category Added Successfully!");
      setItemType("");

      setTimeout(() => {
        setSuccessMessage("");
        router.push("/store");
      }, 1500);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4 text-[#0F6466]">Add Item Category</h2>

        {successMessage && (
          <div className="bg-green-100 text-green-800 p-2 rounded mb-4 text-center">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Item Type</label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-800"
            >
              <option value="">-- Select Item Type --</option>
              <option value="Physical">Physical</option>
              <option value="Digital">Digital</option>
              <option value="Subscription">Subscription</option>
              <option value="Service">Service</option>
              <option value="License Key">License Key</option>
              <option value="Bundle">Bundle</option>
              <option value="Gift Card">Gift Card</option>
              <option value="Downloadable File">Downloadable File</option>
              <option value="Membership">Membership</option>
              <option value="Booking">Booking</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#0F6466] text-white w-full py-2 px-4 rounded hover:bg-[#0e4f50]"
          >
            Add Item Category
          </button>
        </form>
      </div>
    </div>
  );
}

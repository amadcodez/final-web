"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DeleteItemPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [storeID, setStoreID] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const categories = [
    "Electronics", "Fashion", "Home & Kitchen", "Beauty & Personal Care",
    "Sports", "Toys", "Books", "Automotive", "Health", "Baby Products",
    "Pet Supplies", "Grocery", "Furniture", "Stationery", "Garden & Outdoors"
  ];

  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("storeID");
    if (stored) setStoreID(stored);
  }, []);

  useEffect(() => {
    if (!storeID) return;

    fetch(`/api/view-items?storeID=${storeID}`)
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items);
        setFilteredItems(data.items); // Default show all
      })
      .catch((err) => alert(`Error: ${err.message}`));
  }, [storeID]);

  useEffect(() => {
    if (selectedCategory === "") {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter((item) => item.category === selectedCategory));
    }
  }, [selectedCategory, items]);

  const handleItemSelect = (itemID: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemID) ? prev.filter((id) => id !== itemID) : [...prev, itemID]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one item to delete.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/delete-item`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeID, itemIDs: selectedItems }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Selected items deleted successfully!");
        setItems((prev) => prev.filter((item) => !selectedItems.includes(item._id)));
        setSelectedItems([]);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-[#0F6466] text-center mb-6">Delete Item</h2>

      {/* Category Filter Dropdown */}
      <div className="max-w-2xl mx-auto mb-6">
        <select
          className="w-full border px-4 py-2 rounded text-gray-800"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-center text-gray-600">No items found in this category.</p>
      ) : (
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#0F6466] text-white text-left">
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredItems.length}
                    onChange={(e) =>
                      setSelectedItems(
                        e.target.checked ? filteredItems.map((i) => i._id) : []
                      )
                    }
                  />
                </th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Item Name</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item._id)}
                      onChange={() => handleItemSelect(item._id)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <img src={item.itemImages?.[0]} alt="" className="h-12 w-12 rounded" />
                  </td>
                  <td className="px-4 py-2 font-semi-bold text-black">{item.itemName}</td>
                  <td className="px-4 py-2 text-gray-500 font-medium">{item.category || "N/A"}</td>
                  <td className="px-4 py-2 font-semibold text-green-600">
                    Rs.{item.itemPrice}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end px-6 py-4 bg-gray-50">
            <button
              onClick={handleBulkDelete}
              disabled={loading || selectedItems.length === 0}
              className={`${
                loading || selectedItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              } text-white px-5 py-2 rounded-md font-medium transition`}
            >
              {loading ? "Deleting..." : `Delete Selected (${selectedItems.length})`}
            </button>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center pb-4">{error}</div>
          )}
        </div>
      )}
    </div>
  );
}

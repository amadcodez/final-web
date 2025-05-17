"use client";

import React, { useState, useEffect } from "react";

export default function ViewItemsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [storeID, setStoreID] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All", // ✅ Always first
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports",
    "Toys",
    "Books",
    "Automotive",
    "Health",
    "Baby Products",
    "Pet Supplies",
    "Grocery",
    "Furniture",
    "Stationery",
    "Garden & Outdoors",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("storeID");
      if (id) {
        setStoreID(id);
      }
    }
  }, []);

  useEffect(() => {
    if (!storeID) return;

    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/view-items?storeID=${storeID}`);
        const data = await response.json();
        if (response.ok) {
          setItems(data.items || []);
          setFilteredItems(data.items || []);
        } else {
          alert(data.message || "Error fetching items");
        }
      } catch (error: any) {
        alert(`Error: ${error.message}`);
      }
    };

    fetchItems();
  }, [storeID]);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter((item) => item.category === category);
      setFilteredItems(filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h2 className="text-3xl font-bold text-center text-[#0F6466] mb-10">
        View All Items
      </h2>

      {/* 🔥 Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryFilter(cat)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategory === cat
                ? "bg-[#0F6466] text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            } transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🔥 Items Grid */}
      {filteredItems.length === 0 ? (
        <p className="text-center text-lg text-gray-600">
          No items found in this store.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col"
            >
              {/* 🖼️ Image Carousel */}
              {item.itemImages && item.itemImages.length > 0 ? (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-4">
                  {item.itemImages.map((img: string, index: number) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${item.itemName}-${index}`}
                      className="h-32 w-32 object-cover rounded border flex-shrink-0"
                    />
                  ))}
                </div>
              ) : (
                <div className="h-32 bg-gray-200 flex items-center justify-center rounded text-gray-500 text-sm mb-4">
                  No image available
                </div>
              )}

              {/* 🛒 Title */}
              <h3 className="text-lg font-semibold text-[#0F6466]">
                {item.itemName}
              </h3>

              {/* ✏️ Description */}
              <p className="text-gray-600 mt-1 line-clamp-2">
                {item.itemDescription}
              </p>

              {/* 🏷️ Category */}
              <p className="text-xs text-gray-500 mt-2">
                Category: {item.category || "Uncategorized"}
              </p>

              {/* 💵 Price */}
              <div className="mt-auto pt-4">
                <p className="text-lg font-bold text-green-600">
                  Rs.{item.itemPrice}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

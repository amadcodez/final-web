"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StorePage() {
  const [storeID, setStoreID] = useState("");
  const [storeData, setStoreData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("storeID");
    if (stored) {
      setStoreID(stored);
      fetchStoreData(stored);
    }
  }, []);

  const fetchStoreData = async (id: string) => {
    const res = await fetch(`/api/get-store?storeID=${id}`);
    const data = await res.json();
    setStoreData(data.store);
  };

  return (
    <div className="min-h-screen p-6 bg-[#ffe2cc]">
      <div className="bg-white p-6 rounded-xl shadow max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-[#ff6d00] mb-6 text-center">Store Details</h2>

        {storeData ? (
          <div className="mb-6 text-[#37474f] space-y-1">
            <p><strong>Store Name:</strong> {storeData.storeName}</p>
            <p><strong>Item Type:</strong> {storeData.itemType}</p>
            <p><strong>Location:</strong> {storeData.location}</p>
            <p><strong>Categories:</strong> {storeData.numCategories}</p>
          </div>
        ) : (
          <p>Loading store info...</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/store/add-item")}
            className="bg-[#ff6d00] text-white py-2 rounded hover:bg-[#e65100]"
          >
            Add Item
          </button>
          <button
            onClick={() => router.push("/store/view-items")}
            className="bg-[#ff7c1a] text-white py-2 rounded hover:bg-[#ff8a33]"
          >
            View All Items
          </button>
          <button
            onClick={() => router.push("/store/delete-item")}
            className="bg-[#e53935] text-white py-2 rounded hover:bg-[#c62828]"
          >
            Delete Item
          </button>
          <button
            onClick={() => router.push("/store/update-item")}
            className="bg-[#fbc02d] text-white py-2 rounded hover:bg-[#f9a825]"
          >
            Update Item
          </button>
          <button
    onClick={() => router.push("/VendorAnalytics")}
    className="col-span-2 bg-[#1976d2] text-white py-2 rounded hover:bg-[#1565c0]"
  >
    View Analytics
  </button>

          <button
            onClick={() => router.push("/orders")}
            className="col-span-2 bg-[#9c27b0] text-white py-2 rounded hover:bg-[#7b1fa2]"
          >
            View Orders
          </button>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              localStorage.clear();
              router.push("/Login");
            }}
            className="bg-[#263238] text-white py-2 px-4 rounded hover:bg-[#1c1f21]"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
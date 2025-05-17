"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import VendorAnalyticsCards from "@/app/admincomponents/admin/VendorAnalyticsCards";

interface Vendor {
  vendorID: string;
  name: string;
  email: string;
  contact: string;
  storeName: string;
  location: string;
  itemCount: number;
  createdAt: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [itemFilter, setItemFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const vendorsPerPage = 10;

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("/api/admin/vendors");
        const data: Vendor[] = await res.json();
        const unique = Array.from(new Map(data.map(v => [v.vendorID, v])).values());
        setVendors(unique);
      } catch (err) {
        console.error("Failed to load vendors:", err);
      }
    };
    fetchVendors();
  }, []);

  const handleDelete = async (vendorID: string) => {
    const confirmed = confirm("Are you sure you want to delete this vendor and all related data?");
    if (!confirmed) return;

    try {
      const res = await fetch("/api/admin/delete-vendor", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID: vendorID }),
      });
      const result = await res.json();
      if (result.success) {
        alert("Vendor deleted successfully.");
        setVendors((prev) => prev.filter((v) => v.vendorID !== vendorID));
      } else {
        alert(result.error || "Failed to delete vendor");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the vendor.");
    }
  };

  const filtered = vendors.filter(v => {
    const matchesCity = selectedCity === "All" || v.location === selectedCity;
    const matchesItems =
      itemFilter === "All" ||
      (itemFilter === "WithItems" && v.itemCount > 0) ||
      (itemFilter === "NoItems" && v.itemCount === 0);
    const matchesSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.storeName.toLowerCase().includes(search.toLowerCase());
    return matchesCity && matchesItems && matchesSearch;
  });

  const indexOfLast = currentPage * vendorsPerPage;
  const indexOfFirst = indexOfLast - vendorsPerPage;
  const currentVendors = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / vendorsPerPage);
  const uniqueCities = Array.from(new Set(vendors.map(v => v.location)));

  return (
    <div className="px-4 pb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <VendorAnalyticsCards/>
        <h2 className="text-2xl font-semibold text-gray-800">All Vendors</h2>
        <div className="flex gap-3 flex-wrap">
          <input
            type="text"
            placeholder="Search vendors..."
            className="border rounded px-4 py-2 text-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="text-black border rounded px-4 py-2"
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
          >
            <option value="All">All Cities</option>
            {uniqueCities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            className="text-black border rounded px-4 py-2"
            value={itemFilter}
            onChange={e => setItemFilter(e.target.value)}
          >
            <option value="All">All Items</option>
            <option value="WithItems">With Items</option>
            <option value="NoItems">No Items</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full text-sm text-black">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Contact</th>
              <th className="p-4 text-left">Store</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Items</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentVendors.map(v => (
              <tr key={v.vendorID} className="border-b hover:bg-gray-50">
                <td className="p-4">{v.name}</td>
                <td className="p-4">{v.email}</td>
                <td className="p-4">{v.contact}</td>
                <td className="p-4">{v.storeName}</td>
                <td className="p-4">{v.location}</td>
                <td className="p-4">{v.itemCount}</td>
                <td className="p-4">
                  <div className="relative inline-block text-left">
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <MoreHorizontal className="w-5 h-5" />
                      </summary>
                      <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md z-10">
                        <button className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100">
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(v.vendorID)}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    </details>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  StoreIcon,
  ShoppingBag,
  ShoppingCart,
  Box,
  Star,
  ActivitySquare,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Store {
  storeID: string;
  storeName: string;
  location: string;
  vendorName: string;
  email: string;
  productCount: number;
  orderCount: number;
  totalRevenue?: number;
  createdAt: string;
}

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStore, setSelectedStore] = useState("");

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [inactiveStores, setInactiveStores] = useState(0);
  const [activeStores, setActiveStores] = useState(0);
  const [mostActiveStore, setMostActiveStore] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  const storesPerPage = 10;

  useEffect(() => {
    const fetchStores = async () => {
      const res = await fetch("/api/admin/stores");
      const data = await res.json();
      setStores(data);

      // Stats
      setTotalProducts(data.reduce((sum: number, s: Store) => sum + s.productCount, 0));
      setTotalOrders(data.reduce((sum: number, s: Store) => sum + s.orderCount, 0));
      setInactiveStores(data.filter((s: Store) => s.productCount === 0).length);
      setActiveStores(data.filter((s: Store) => s.productCount > 0).length);

      const active = data.sort((a: Store, b: Store) => b.orderCount - a.orderCount)[0];
      setMostActiveStore(active?.storeName || null);
    };
    fetchStores();
  }, []);

  useEffect(() => {
    const filtered = stores
      .filter((s) => s.productCount > 0)
      .filter((s) => (selectedStore ? s.storeID === selectedStore : true))
      .map((s) => ({
        storeID: s.storeID,
        storeName: s.storeName,
        orders: s.orderCount,
        revenue: s.totalRevenue || 0,
      }));

    setAnalyticsData(filtered);
  }, [stores, selectedStore]);

  const filtered = stores.filter((s) => {
    const matchSearch =
      s.storeName.toLowerCase().includes(search.toLowerCase()) ||
      s.vendorName.toLowerCase().includes(search.toLowerCase());
    const matchLocation = locationFilter === "All" || s.location === locationFilter;
    return matchSearch && matchLocation;
  });

  const indexOfLast = currentPage * storesPerPage;
  const indexOfFirst = indexOfLast - storesPerPage;
  const currentStores = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / storesPerPage);
  const uniqueLocations = Array.from(new Set(stores.map((s) => s.location)));

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">All Stores</h2>

      {/* ==== STAT CARDS ==== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
          <div>
            <p className="text-gray-500 text-sm">Total Stores</p>
            <h3 className="text-gray-700 2xl font-bold">{stores.length}</h3>
          </div>
          <div className="bg-blue-100 p-2 rounded-full">
            <StoreIcon className="text-blue-600" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
          <div>
            <p className="text-gray-500 text-sm">Active Stores</p>
            <h3 className="text-2xl font-bold text-green-600">{activeStores}</h3>
          </div>
          <div className="bg-green-100 p-2 rounded-full">
            <ActivitySquare className="text-green-600" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
          <div>
            <p className="text-gray-500 text-sm">Inactive Stores</p>
            <h3 className="text-2xl font-bold text-red-500">{inactiveStores}</h3>
          </div>
          <div className="bg-red-100 p-2 rounded-full">
            <ActivitySquare className="text-red-500" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
          <div>
            <p className="text-gray-500 text-sm">Total Products</p>
            <h3 className="text-gray-700 2xl font-bold">{totalProducts}</h3>
          </div>
          <div className="bg-yellow-100 p-2 rounded-full">
            <Box className="text-yellow-600" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h3 className="text-gray-700 2xl font-bold">{totalOrders}</h3>
          </div>
          <div className="bg-purple-100 p-2 rounded-full">
            <ShoppingCart className="text-purple-600" />
          </div>
        </div>

        <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
          <div>
            <p className="text-gray-500 text-sm">Most Active Store</p>
            <h3 className="text-lg font-bold text-indigo-600">
              {mostActiveStore || "N/A"}
            </h3>
          </div>
          <div className="bg-indigo-100 p-2 rounded-full">
            <Star className="text-indigo-600" />
          </div>
        </div>
      </div>

      {/* ==== ANALYTICS CHART ==== */}
      <div className="bg-white p-6 rounded-lg shadow mt-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black">Store Analytics</h3>
          <select
            className="border px-4 py-2 rounded text-sm text-black"
            value={selectedStore}
            onChange={(e) => setSelectedStore(e.target.value)}
          >
            <option value="">All Active Stores</option>
            {stores
              .filter((s) => s.productCount > 0)
              .map((store) => (
                <option key={store.storeID} value={store.storeID}>
                  {store.storeName}
                </option>
              ))}
          </select>
        </div>

        {analyticsData.length === 0 ? (
          <p className="text-sm text-gray-700">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
  <BarChart data={analyticsData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="storeName" />
    <YAxis yAxisId="left" allowDecimals={false} />
    <YAxis yAxisId="right" orientation="right" />
    <Tooltip />
    <Legend />
    <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" />
    <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue (Rs.)" />
  </BarChart>
</ResponsiveContainer>

        )}
      </div>

      {/* ==== FILTERS ==== */}
      <div className="flex gap-4 flex-wrap items-center mt-6">
        <input
          type="text"
          placeholder="Search by store or vendor name"
          className="border px-4 py-2 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border px-4 py-2 rounded text-black"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          <option value="All">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* ==== TABLE ==== */}
      <div className="overflow-x-auto bg-white rounded shadow mt-4">
        <table className="min-w-full text-sm text-black">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4 text-left">Store Name</th>
              <th className="p-4 text-left">Vendor Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Products</th>
              <th className="p-4 text-left">Orders</th>
              <th className="p-4 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {currentStores.map((store) => (
              <tr key={store.storeID} className="border-b hover:bg-gray-50">
                <td className="p-4">{store.storeName}</td>
                <td className="p-4">{store.vendorName}</td>
                <td className="p-4">{store.email}</td>
                <td className="p-4">{store.location}</td>
                <td className="p-4">{store.productCount}</td>
                <td className="p-4">{store.orderCount}</td>
                <td className="p-4">
                  {new Date(store.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ==== PAGINATION ==== */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

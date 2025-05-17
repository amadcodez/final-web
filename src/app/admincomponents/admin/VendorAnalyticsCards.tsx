"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

interface Vendor {
  vendorID: string;
  name: string;
  email: string;
  contact: string;
  storeName: string;
  location: string;
  itemCount: number;
  orderCount: number;
  createdAt: string;
}

export default function VendorAnalyticsCards() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState("All");
  const [selectedMetric, setSelectedMetric] = useState("orderCount");
  const [selectedCity, setSelectedCity] = useState("All");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch("/api/admin/vendors");
        const data: Vendor[] = await res.json();
        const unique = Array.from(new Map(data.map(v => [v.vendorID, v])).values());
        setVendors(unique);
        setChartData(unique);
      } catch (err) {
        console.error("Failed to load vendors:", err);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    let filtered = vendors;

    if (selectedVendor !== "All") {
      filtered = filtered.filter((v) => v.vendorID === selectedVendor);
    }

    if (selectedCity !== "All") {
      filtered = filtered.filter((v) => v.location === selectedCity);
    }

    setChartData(filtered);
  }, [selectedVendor, selectedCity, selectedMetric, vendors]);

  const metricOptions = [
    { value: "orderCount", label: "🛒 Orders Count" },
    { value: "itemCount", label: "📦 Products Count" },
  ];

  const uniqueCities = Array.from(new Set(vendors.map((v) => v.location))).filter(Boolean);

  return (
    <div className="p-6 space-y-6 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800">Vendor Analytics</h2>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          className="border px-4 py-2 rounded text-black"
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
        >
          <option value="All">All Vendors</option>
          {vendors.map((v) => (
            <option key={v.vendorID} value={v.vendorID}>
              {v.name}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded text-black"
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
        >
          {metricOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded text-black"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="All">All Cities</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow p-6 w-full">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} height={60} />
            <YAxis />
            <Tooltip />
            <Legend
  verticalAlign="top"
  wrapperStyle={{ paddingBottom: 20 }}
  formatter={() =>
    selectedMetric === "itemCount" ? "Products" : "Orders"
  }
/>

            <Bar dataKey={selectedMetric} fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

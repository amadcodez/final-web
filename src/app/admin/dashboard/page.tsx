"use client";
import RevenueOverview from "@/app/admincomponents/admin/RevenueOverview";
import TopCustomers from "@/app/admincomponents/admin/TopCustomers";
import Sidebar from "@/app/admincomponents/admin/Sidebar";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  Store,
  ShoppingCart,
  DollarSign,
  Box,
  Grid,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ title, value, icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition duration-150 flex justify-between items-center">

      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-900">{value}</h3>
      </div>
      <div className={`w-10 h-10 flex items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    vendorsCount: 0,
    storesCount: 0,
    totalOrders: 0,
    totalRevenue: 0,
    outOfStockCount: 0,
    categoryCount: 0,
  });

  const [salesData, setSalesData] = useState<{ name: string; orders: number }[]>([]);
  const [topVendors, setTopVendors] = useState<{ name: string; orders: number }[]>([]);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/overview");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    const fetchOrderTrend = async () => {
      try {
        const res = await fetch(`/api/admin/sales-trend?range=${range}`);
        const data = await res.json();
        setSalesData(data);
      } catch (err) {
        console.error("Failed to load order trend:", err);
      }
    };

    const fetchTopVendors = async () => {
      try {
        const res = await fetch("/api/admin/top-vendors");
        const data = await res.json();
        setTopVendors(data);
      } catch (err) {
        console.error("Failed to load top vendors:", err);
      }
    };

    fetchStats();
    fetchOrderTrend();
    fetchTopVendors();
  }, [range]);

  return (
    <div className="p-6 space-y-6 bg-[#f9fafb] min-h-screen">

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Dashboard / Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="Total Vendors" value={stats.vendorsCount} icon={<Users className="w-5 h-5 text-purple-600" />} iconBg="bg-purple-100" />
        <StatCard title="Total Stores" value={stats.storesCount} icon={<Store className="w-5 h-5 text-blue-600" />} iconBg="bg-blue-100" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingCart className="w-5 h-5 text-yellow-600" />} iconBg="bg-yellow-100" />
        <StatCard title="Total Revenue" value={`Rs.${stats.totalRevenue}`} icon={<DollarSign className="w-5 h-5 text-green-600" />} iconBg="bg-green-100" />
        <StatCard title="Out of Stock Items" value={stats.outOfStockCount} icon={<Box className="w-5 h-5 text-red-600" />} iconBg="bg-red-100" />
        <StatCard title="Total Categories" value={stats.categoryCount} icon={<Grid className="w-5 h-5 text-pink-600" />} iconBg="bg-pink-100" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
  <div className="col-span-2">
    <RevenueOverview />
  </div>
  <div>
    <TopCustomers />
  </div>
</div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        
        <div className="col-span-2 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Orders Trend</h3>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border border-gray-300 text-black sm px-2 py-1 rounded"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="3m">Last 3 Months</option>
              <option value="1y">Last 12 Months</option>
            </select>
          </div>

          {salesData.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No order data available for this range.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Vendors</h3>
          <ul className="space-y-4">
            {topVendors.map((vendor, index) => (
              <li key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                    {vendor.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{vendor.name}</p>
                    <p className="text-xs text-gray-500">{vendor.orders} orders</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

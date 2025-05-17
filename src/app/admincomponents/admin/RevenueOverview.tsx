"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function RevenueOverview() {
  const [range, setRange] = useState("6m");
  const [revenueData, setRevenueData] = useState<{ name: string; revenue: number }[]>([]);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await fetch(`/api/admin/revenue-trend?range=${range}`);
        const data = await res.json();
        setRevenueData(data);
      } catch (err) {
        console.error("Failed to fetch revenue data", err);
      }
    };

    fetchRevenue();
  }, [range]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value)}
          className="border border-gray-300 text-black sm px-2 py-1 rounded"
        >
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last 12 Months</option>
        </select>
      </div>

      {revenueData.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No revenue data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              fill="url(#colorRevenue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

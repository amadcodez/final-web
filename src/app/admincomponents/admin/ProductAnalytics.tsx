'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

export default function ProductAnalytics() {
  const [chartData, setChartData] = useState([]);
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await fetch('/api/admin/product-chart');
        const data = await res.json();
        setChartData(data.byVendor || []);
        setStockData(data.byStock || []);
      } catch (err) {
        console.error('Chart data load failed:', err);
      }
    };

    fetchChartData();
  }, []);

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      {/* Vendor Bar Chart */}
      <div className="bg-white shadow-sm p-4 rounded-lg">
        <h2 className="text-base font-bold text-gray-800 mb-2">Products by Vendor</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="vendorName" />
            <YAxis />
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              labelStyle={{ color: '#000', fontWeight: 'bold' }}
              itemStyle={{ color: '#6b46c1', fontWeight: 'bold' }}
            />
            <Legend />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Pie Chart */}
      <div className="bg-white shadow-sm p-4 rounded-lg">
        <h2 className="text-base font-bold text-gray-800 mb-2">Stock Overview</h2>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={stockData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={70}
              fill="#8884d8"
              label
            >
              {stockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
              labelStyle={{ color: '#000', fontWeight: 'bold' }}
              itemStyle={{ color: '#000' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

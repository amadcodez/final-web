"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface Order {
  orderID: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  total: number;
  date: string;
  cartItems: {
    title: string;
    quantity: number;
    vendorName: string;
  }[];
}

const COLORS = ["#00C49F", "#FF8042"];
const dateRanges = [
  { label: "All Time", value: "all" },
  { label: "Last 24 Hours", value: "24h" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 1 Year", value: "1y" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [topProducts, setTopProducts] = useState<
    { title: string; quantity: number }[]
  >([]);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; revenue: number }[]
  >([]);
  const [selectedCity, setSelectedCity] = useState<string>("All");
  const [selectedVendor, setSelectedVendor] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(data);

      const revenue = data.reduce(
        (sum: number, order: Order) => sum + order.total,
        0
      );
      setTotalRevenue(revenue);

      const monthlyMap: Record<string, number> = {};
      data.forEach((order: Order) => {
        const date = new Date(order.date);
        const month = date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        monthlyMap[month] = (monthlyMap[month] || 0) + order.total;
      });
      const monthlyArray = Object.entries(monthlyMap).map(
        ([month, revenue]) => ({ month, revenue })
      );
      setMonthlyData(monthlyArray);

      const productMap: Record<string, number> = {};
      data.forEach((order: Order) => {
        order.cartItems.forEach((item) => {
          productMap[item.title] =
            (productMap[item.title] || 0) + item.quantity;
        });
      });
      const topArray = Object.entries(productMap)
        .map(([title, quantity]) => ({ title, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 3);
      setTopProducts(topArray);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCity, search, dateFilter, selectedVendor]);

  const filteredOrders = orders.filter((order) => {
    const matchesCity = selectedCity === "All" || order.city === selectedCity;
    const matchesSearch =
      order.firstName.toLowerCase().includes(search.toLowerCase()) ||
      order.lastName.toLowerCase().includes(search.toLowerCase()) ||
      order.phone.includes(search);

    const matchesVendor =
      selectedVendor === "All" ||
      order.cartItems.some((item) => item.vendorName === selectedVendor);

    const orderDate = new Date(order.date);
    const now = new Date();
    let matchesDate = true;

    if (dateFilter === "24h") {
      matchesDate = now.getTime() - orderDate.getTime() <= 24 * 60 * 60 * 1000;
    } else if (dateFilter === "7d") {
      matchesDate =
        now.getTime() - orderDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
    } else if (dateFilter === "30d") {
      matchesDate =
        now.getTime() - orderDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
    } else if (dateFilter === "1y") {
      matchesDate =
        now.getTime() - orderDate.getTime() <= 365 * 24 * 60 * 60 * 1000;
    }

    return matchesCity && matchesSearch && matchesVendor && matchesDate;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const uniqueCities = Array.from(new Set(orders.map((o) => o.city)));
  const uniqueVendors = Array.from(
    new Set(orders.flatMap((o) => o.cartItems.map((item) => item.vendorName)))
  );

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-1 text-sm text-gray-400 mb-2">
  <a href="/admin/dashboard" className="text-gray-400 hover:no-underline">Admin</a>
  <span>/</span>
  <a href="/admin/orders" className="text-gray-700 font-medium hover:no-underline">Orders</a>
</nav>


      {/* Section Title and Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500 mb-1">Total Orders</h2>
            <p className="text-2xl font-semibold text-gray-900">
              {orders.length}
            </p>
            <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full mt-2 inline-block">
              +10.9%
            </span>
          </div>
          <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
            📦
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500 mb-1">Total Revenue</h2>
            <p className="text-2xl font-semibold text-gray-900">
              Rs. {totalRevenue}
            </p>
            <span className="text-green-600 text-xs font-medium bg-green-100 px-2 py-0.5 rounded-full mt-2 inline-block">
              +5.9%
            </span>
          </div>
          <div className="bg-pink-100 text-pink-600 p-3 rounded-full">💰</div>
        </div>

        {/* Top Product */}
        <div className="bg-white p-5 rounded-xl shadow-sm border flex items-center justify-between">
          <div>
            <h2 className="text-sm text-gray-500 mb-1">Top Product</h2>
            <p className="text-base font-medium text-gray-800">
              {topProducts[0]?.title || "N/A"}
            </p>
            <span className="text-red-600 text-xs font-medium bg-red-100 px-2 py-0.5 rounded-full mt-2 inline-block">
              -3.2%
            </span>
          </div>
          <div className="bg-orange-100 text-orange-600 p-3 rounded-full">
            🛍️
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Monthly Revenue
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Top Selling Products
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={topProducts}
                dataKey="quantity"
                nameKey="title"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {topProducts.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-black flex gap-4 flex-col sm:flex-row">
        <select
          className="border px-4 py-2 rounded-md"
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

        <select
          className="border px-4 py-2 rounded-md"
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
        >
          <option value="All">All Vendors</option>
          {uniqueVendors.map((vendor) => (
            <option key={vendor} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>

        <select
          className="border px-4 py-2 rounded-md"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by name or phone..."
          className="border px-4 py-2 rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="mt-6 overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-left">Order ID</th>
              <th className="p-4 text-left">Customer</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">City</th>
              <th className="p-4 text-left">Total</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Items</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.orderID} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium">{order.orderID}</td>
                <td className="p-4">
                  {`${order.firstName} ${order.lastName}`.trim() || "N/A"}
                </td>
                <td className="p-4">{order.phone}</td>
                <td className="p-4">{order.city}</td>
                <td className="p-4">Rs. {order.total}</td>
                <td className="p-4">{order.date}</td>
                <td className="p-4 space-y-1">
                  {order.cartItems.map((item, index) => (
                    <p key={index}>
                      • {item.title} (x{item.quantity}) —{" "}
                      <span className="text-xs italic text-gray-500">
                        {item.vendorName}
                      </span>
                    </p>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

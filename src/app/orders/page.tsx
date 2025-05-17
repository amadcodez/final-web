'use client';

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any>({});

  useEffect(() => {
    const storeID = localStorage.getItem('storeID');
    if (storeID) {
      fetch(`/api/vendor-orders?storeID=${storeID}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(data.orders || []);

          // ✅ Count product quantities
          const countMap: any = {};
          data.orders?.forEach((order: any) => {
            order.cartItems?.forEach((item: any) => {
              if (countMap[item.title]) {
                countMap[item.title] += item.quantity;
              } else {
                countMap[item.title] = item.quantity;
              }
            });
          });
          setTopItems(countMap);
        });
    }
  }, []);

  const chartData = {
    labels: Object.keys(topItems),
    datasets: [
      {
        label: 'Units Sold',
        data: Object.values(topItems),
        backgroundColor: '#0ea5e9', // sky-500
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Your Store Orders</h1>

      {/* ✅ Chart Section */}
      <div className="max-w-4xl mx-auto mb-10 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Hot Selling Items</h2>
        {Object.keys(topItems).length > 0 ? (
          <Bar data={chartData} />
        ) : (
          <p className="text-gray-500">No data to show yet.</p>
        )}
      </div>

      {/* ✅ Orders Table */}
      <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-800 font-semibold">
            <tr>
              <th className="px-4 py-3">Customer Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Payment Method</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Placed On</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 text-gray-700">
                <td className="px-4 py-3 font-medium">
                  {order.firstName} {order.lastName}
                </td>
                <td className="px-4 py-3">{order.phone}</td>
                <td className="px-4 py-3 capitalize">{order.paymentMethod}</td>
                <td className="px-4 py-3 whitespace-pre-line">
                  {order.cartItems?.map((item: any, idx: number) => (
                    <div key={idx}>
                      {item.title} × {item.quantity} (${item.price})
                    </div>
                  ))}
                </td>
                <td className="px-4 py-3">
                  {order.date ? new Date(order.date).toLocaleString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

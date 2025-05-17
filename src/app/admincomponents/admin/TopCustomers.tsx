"use client";

import { useEffect, useState } from "react";

interface Customer {
  name: string;
  email: string;
}

export default function TopCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/admin/top-customers");
        const data = await res.json();
        setCustomers(data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Top Customers</h3>
        <select className="border text-sm px-2 py-1 rounded text-gray-500" disabled>
          <option>This month</option>
        </select>
      </div>

      <ul className="space-y-4">
        {customers.map((customer, index) => {
          const initials = customer.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);

          return (
            <li key={index} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {initials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                <p className="text-xs text-gray-500">{customer.email}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

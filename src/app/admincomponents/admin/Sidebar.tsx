"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  ShoppingCart,
  Package,
  LogOut,
  Inbox,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Vendors", href: "/admin/vendors", icon: Users },
    { label: "Stores", href: "/admin/stores", icon: Store },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Products", href: "/admin/products", icon: Package },
  ];

  const handleLogout = async () => {
  await fetch("/api/admin/logout", {
    method: "GET",
    credentials: "include", // ✅ Sends HttpOnly cookie to server
  });

  // Also clear localStorage
  localStorage.clear();
  window.location.href = "/AdminLogin"; // Redirect to login page
};


  return (
    <aside className="w-60 fixed top-0 left-0 h-screen bg-white shadow-lg p-6 z-40 flex flex-col justify-between">
      {/* Top: Nav */}
      <div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-blue-600">COVO</h2>
        </div>

        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Bottom: Logout */}
      <div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:text-white hover:bg-red-600 transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

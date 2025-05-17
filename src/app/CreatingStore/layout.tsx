// app/CreatingStore/layout.tsx
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-[#0F6466]">Creating Store</h1>
      </header>
      <main>{children}</main>
    </div>
  );
}

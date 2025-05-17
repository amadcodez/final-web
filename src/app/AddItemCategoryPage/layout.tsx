import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

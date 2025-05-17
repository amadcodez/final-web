// app/cart/layout.tsx
import React from 'react';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen bg-white text-gray-900">
      <div className="py-8">
        {children}
      </div>
    </section>
  );
}

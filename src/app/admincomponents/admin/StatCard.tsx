'use client';

import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg: string;
}

export default function StatCard({ title, value, icon, iconBg }: StatCardProps) {
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

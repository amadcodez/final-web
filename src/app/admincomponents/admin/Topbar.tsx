'use client';

export default function Topbar() {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <h1 className="text-xl font-semibold text-black">Admin Dashboard</h1>
      <div className="flex gap-4 items-center">
        <button className="text-sm text-gray-600">Month to date</button>
        <button className="bg-green-500 text-white px-4 py-1 rounded-md text-sm">Export</button>
      </div>
    </div>
  );
}

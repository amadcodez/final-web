// app/admin/layout.tsx
import Sidebar from "@/app/admincomponents/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-60 bg-[#f9fafb] min-h-screen p-6">
        {children}
      </div>
    </div>
  );
}

// Import custom components
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Layout container with sidebar and main section
    <div className="flex w-full min-h-screen bg-gray-200">
      {/* Side navbar*/}
      <AdminSidebar />

      {/* content page container*/}
      <div className="flex-1">
        {/* page header */}
        <AdminHeader />

        {/* main content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

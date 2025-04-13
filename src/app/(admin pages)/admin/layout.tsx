// Import custom components
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import AdminPageLayout from "@/components/AdminPageLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Main layout: column layout to support full height
    <div className="min-h-screen flex">
      {/* Sidebar: fixed width, stretch full height */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* page header */}
        <AdminHeader />

        {/* main content */}
        <main className="flex-1 overflow-auto">
          <AdminPageLayout>{children}</AdminPageLayout>
        </main>
      </div>
    </div>
  );
}

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
    // Layout container with sidebar and main section
    <div className="flex w-full min-h-screen bg-gray-200">
      {/* Side navbar*/}
      <AdminSidebar />

      {/* content page container*/}
      <div className="flex-1">
        {/* page header */}
        <AdminHeader />

        {/* main content */}
        <AdminPageLayout>{children}</AdminPageLayout>
      </div>
    </div>
  );
}

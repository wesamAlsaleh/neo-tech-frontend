// Import custom components
import NavBar from "@/components/NavBar";
import ClientPageLayout from "@/components/ClientPageLayout";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Navigation Bar */}
      <NavBar />

      {/* Content section below the navbar */}
      <div className="flex-1 overflow-y-auto">
        <ClientPageLayout>{children}</ClientPageLayout>
      </div>
    </div>
  );
}

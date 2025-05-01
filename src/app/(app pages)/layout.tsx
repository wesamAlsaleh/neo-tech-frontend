// Import custom components
import NavBar from "@/components/NavBar";
import ClientPageLayout from "@/components/ClientPageLayout";
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen bg-gray-200">
      {/* Navigation Bar - fixed height */}
      <NavBar />

      {/* Main content area - flex-grow to push footer down */}
      <main className="flex-grow">
        <ClientPageLayout>{children}</ClientPageLayout>
      </main>

      {/* Footer - will stay at bottom */}
      <Footer />
    </div>
  );
}

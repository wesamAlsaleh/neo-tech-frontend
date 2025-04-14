import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function ClientPageLayout({ children }: PageLayoutProps) {
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-white min-h-screen">{children}</div>
  );
}

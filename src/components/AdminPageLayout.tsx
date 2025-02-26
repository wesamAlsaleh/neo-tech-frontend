import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function AdminPageLayout({ children }: PageLayoutProps) {
  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gray-100 min-h-screen">
      {children}
    </div>
  );
}

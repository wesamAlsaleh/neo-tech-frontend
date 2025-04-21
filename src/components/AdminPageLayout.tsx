import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function AdminPageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex-1 p-6 overflow-auto bg-white min-h-screen">
      {children}
    </div>
  );
}

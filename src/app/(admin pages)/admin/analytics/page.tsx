import React from "react";

// import components
import PageTitle from "@/components/PageTitle";
import SalesReport from "@/components/SalesReport";

export default function page() {
  return (
    <div>
      <PageTitle title="Sales Reports" />

      {/* Main Section */}
      <SalesReport />
    </div>
  );
}

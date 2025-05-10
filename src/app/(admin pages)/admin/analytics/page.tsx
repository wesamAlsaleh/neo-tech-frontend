"use client";

import React from "react";
import { useRouter } from "next/navigation";

// import Icons
import { icons } from "../../../../../public/icons";

// import components
import PageTitle from "@/components/PageTitle";
import SalesReport from "@/components/SalesReport";
import Button from "@/components/Button";

export default function page() {
  // Router Instance
  const router = useRouter();

  return (
    <div>
      <PageTitle
        title="Sales Reports"
        actionButton={
          <Button
            text="Excel Sheet"
            iconSrc={icons.excelIcon96.src}
            onClick={() => {}}
          />
        }
      />

      {/* Main Section */}
      <SalesReport />
    </div>
  );
}

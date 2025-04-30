"use client";

import React from "react";
import { useRouter } from "next/navigation";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import SaleProductsList from "@/components/SaleProductsList";
import Separator from "@/components/Separator";
import FlashSalesList from "@/components/FlashSalesList";
import Button from "@/components/Button";

export default function page() {
  // Router Instance
  const router = useRouter();

  return (
    <>
      <PageTitle
        title="Sales Settings"
        subtitle="Manage NeoTech Flash Sales"
        actionButton={
          <Button
            text="Add Flash Sale"
            onClick={() => {
              router.push("/admin/customize/sales/create-flash-sale");
            }}
          />
        }
        actionButton2={
          <Button
            text="Manage Products"
            onClick={() => {
              router.push("/admin/products");
            }}
          />
        }
      />

      {/* Products on Sale list */}
      <SaleProductsList />

      {/* Separator */}
      <Separator color="border-gray-400" margin="my-6" />

      {/* Flash list  */}
      <FlashSalesList />
    </>
  );
}

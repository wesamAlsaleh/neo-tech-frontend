import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import SaleProductsList from "@/components/SaleProductsList";
import Separator from "@/components/Separator";
import FlashSalesList from "@/components/FlashSalesList";
import Button from "@/components/Button";

export default function page() {
  return (
    <>
      <PageTitle
        title="Sales Settings"
        subtitle="Here you can manage and customize NeoTech sales settings"
        actionButton={
          <ActionButton
            text="Add Flash Sale"
            href="/admin/customize/sales/create-flash-sale"
          />
          <Button />
        }
        actionButton2={
          <ActionButton
            text="Manage Products"
            href="/admin/products"
            color="steelblue"
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

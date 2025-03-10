import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import SaleProductsList from "@/components/SaleProductsList";
import Separator from "@/components/Separator";

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
      <Separator
        color="border-gray-200"
        thickness="border-t"
        width="w-full"
        margin="my-4"
      />

      {/* Flash list  */}
      {/* <FlashSalesList /> */}
    </>
  );
}

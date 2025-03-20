import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import SaleProductsList from "@/components/SaleProductsList";
import Separator from "@/components/Separator";
import FlashSalesList from "@/components/FlashSalesList";

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
        actionButton3={
          <ActionButton
            href="/admin/customize"
            text="Back"
            buttonTitle="Go back to Customize NeoTech Shop"
            color="white"
            textColor="black"
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

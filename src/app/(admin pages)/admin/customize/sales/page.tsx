import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import SaleProductsList from "@/components/SaleProductsList";
import { icons } from "../../../../../../public/icons";

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

      {/* Flash list  */}
      {/* <FlashSalesList /> */}
    </>
  );
}

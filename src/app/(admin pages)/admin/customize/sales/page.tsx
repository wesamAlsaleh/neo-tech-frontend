import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import SaleProductsList from "@/components/SaleProductsList";

export default function page() {
  return (
    <>
      <PageTitle
        title="Sales Settings"
        subtitle="Here you can manage and customize NeoTech sales settings"
        actionButton={<ActionButton text="Add Flash Sale" href="" />}
        actionButton2={<ActionButton text="Add Coupon (coming soon)" href="" />}
      />

      {/* Products on Sale list */}
      <SaleProductsList />
    </>
  );
}

import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import TrashedProductsList from "@/components/TrashedProductsList";

export default function page() {
  return (
    <>
      <PageTitle
        title="Products Recycle Bin"
        subtitle="Here you can restore or delete products that have been trashed."
        actionButton={<ActionButton text="Back" href="/admin/products" />}
      />

      {/* Trashed Products List */}
      <TrashedProductsList />
    </>
  );
}

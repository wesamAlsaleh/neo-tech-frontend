import React from "react";

// import custom components
import { ActionButton } from "@/components/ActionButton";
import AddFlashSaleForm from "@/components/AddFlashSaleForm";
import PageTitle from "@/components/PageTitle";

export default function page() {
  return (
    <>
      <PageTitle
        title="Create Flash Sale"
        subtitle="Here you can create a new flash sale"
        actionButton={
          <ActionButton
            text="Cancel"
            color="red"
            href="/admin/customize/sales/"
          />
        }
      />

      {/* Form */}
      <AddFlashSaleForm />
    </>
  );
}

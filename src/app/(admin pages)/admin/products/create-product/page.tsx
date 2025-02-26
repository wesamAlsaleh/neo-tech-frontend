import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import AddProductForm from "@/components/AddProductForm";

export default function page() {
  return (
    <>
      <PageTitle
        title="Add New Category"
        subtitle="Here you can add a new category"
        actionButton={
          <ActionButton href="/admin/products" text="Cancel" color="red" />
        }
      />

      {/* Add Product Form */}
      <AddProductForm />
    </>
  );
}

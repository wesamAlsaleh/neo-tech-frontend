import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import AddProductForm from "@/components/AddProductForm";

export default function page() {
  return (
    <>
      <PageTitle
        title="Add New Product"
        subtitle="Here you can add a new product to the store"
        highlightText="The recommended image size for product images is 4500x3000 pixels"
        actionButton={
          <ActionButton href="/admin/products" text="Cancel" color="red" />
        }
      />

      {/* Add Product Form */}
      <AddProductForm />
    </>
  );
}

"use client";

import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import AddProductForm from "@/components/AddProductForm";
import Button from "@/components/Button";

export default function page() {
  return (
    <>
      <PageTitle
        title="Add New Product"
        subtitle="Here you can add a new product to the store"
        highlightText="The recommended image size for product images is 4500x3000 pixels"
        actionButton={
          <Button
            text="Back"
            onClick={() => {
              window.history.back();
            }}
          />
        }
      />

      {/* Add Product Form */}
      <AddProductForm />
    </>
  );
}

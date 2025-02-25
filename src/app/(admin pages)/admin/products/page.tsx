import React from "react";

// import custom components
import ProductsList from "@/components/ProductsList";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import { RecycleButton } from "@/components/RecycleButton";

export default function ManageProductsPage() {
  return (
    <>
      <PageTitle
        title="Products"
        subtitle="Manage products here"
        actionButton={
          <ActionButton
            href="/admin/products/create-product"
            text="Add Product"
            buttonTitle="Add a new product"
          />
        }
        recycleButton={<RecycleButton href="/admin/products/recycle-bin" />}
      />

      {/* products table */}
      <ProductsList />
    </>
  );
}

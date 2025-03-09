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
        actionButton2={
          <ActionButton
            href="/admin/customize/sales"
            text="Manage Flash Sales"
            buttonTitle="Manage flash sales"
            color="steelblue"
          />
        }
        recycleButton={<RecycleButton href="/admin/products/recycle-bin" />}
      />

      {/* products table */}
      <ProductsList />
    </>
  );
}

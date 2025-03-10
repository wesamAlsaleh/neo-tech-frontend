import React from "react";

// import icons

// import custom components
import ProductsList from "@/components/ProductsList";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import { RecycleButton } from "@/components/RecycleButton";
import { icons } from "../../../../../public/icons";

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
        actionButton3={
          <ActionButton
            href="/admin/products/recycle-bin"
            text="Recycle Button"
            isIconButton
            iconSrc={icons.recycleIcon48.src}
            color="yellowgreen"
          />
        }
      />

      {/* products table */}
      <ProductsList />
    </>
  );
}

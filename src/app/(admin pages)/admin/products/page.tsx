"use client";

import React from "react";

// import icons
import { icons } from "../../../../../public/icons";

// import custom components
import ProductsList from "@/components/ProductsList";
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export default function ManageProductsPage() {
  // Router instance
  const router = useRouter();

  return (
    <>
      <PageTitle
        title="Products"
        subtitle="Manage NeoTech products"
        actionButton={
          <Button
            text="Add Product"
            onClick={() => {
              router.push("/admin/products/create-product");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        }
        actionButton2={
          <Button
            text="Manage Flash Sales"
            onClick={() => {
              router.push("/admin/customize/sales");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        }
        // actionButton3={
        //   <ActionButton
        //     href="/admin/products/recycle-bin"
        //     text="Recycle Button"
        //     isIconButton
        //     iconSrc={icons.recycleIcon48.src}
        //     color="yellowgreen"
        //   />
        // }
      />

      {/* products table */}
      <ProductsList />
    </>
  );
}

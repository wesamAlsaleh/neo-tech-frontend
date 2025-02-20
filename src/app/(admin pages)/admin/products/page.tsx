import React from "react";

// import custom components
import ProductsList from "@/components/ProductsList";
import AddProductForm from "@/components/AddProductForm";
import PageTitle from "@/components/PageTitle";

export default function ManageProductsPage() {
  return (
    // Page Container to handle scrolling
    <div>
      <PageTitle title="Products" subtitle="Manage products here" />

      {/* products table */}
      <ProductsList />

      {/* add product form */}
      {/* <AddProductForm /> */}
    </div>
  );
}

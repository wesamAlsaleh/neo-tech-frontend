import React from "react";

// import custom components
import ProductsList from "@/components/ProductsList";
import AddProductForm from "@/components/AddProductForm";

export default function ManageProductsPage() {
  return (
    // Page Container to handle scrolling
    <div className="max-h-screen overflow-y-auto">
      {/* Layout container 'main' */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
        <p className="mb-8">Here you can manage products</p>

        {/* products table */}
        {/* <ProductsList /> */}

        {/* add product form */}
        {/* <AddProductForm /> */}
      </div>
    </div>
  );
}

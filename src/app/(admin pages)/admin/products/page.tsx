"use client";

import React, { useEffect, useState } from "react";

// import types
import { Products } from "@/types/product";

// Services import
import { getProducts } from "@/services/products-services";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ManageProductsPage() {
  return (
    // Page Container to handle scrolling
    <div className="max-h-screen overflow-y-auto">
      {/* Layout container */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
        <p className="mb-8">Here you can manage products</p>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";

// import services
import { displayFlashSale } from "@/services/sale-services";

// import types
import { FlashSale } from "@/types/sale";
import { Product } from "@/types/product";

// import custom components
import HomeComponentTitle from "./HomeComponentTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCardShowcase from "@/components/ProductCardShowcase";

export default function FlashSalesSection() {
  // pagination state
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // loading state
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  // Data state
  const [flashSale, setFlashSale] = useState<FlashSale>(); // Flash sales data
  const [products, setProducts] = useState<Product[]>([]); // Products data

  // Fetch the flash from the server
  useEffect(() => {
    // get the flash sales from the server
    const fetchFlashSale = async () => {
      try {
        // fetch the flash sales from the server
        const response = await displayFlashSale(8, page);

        // check if the response is successful
        if (response.status) {
          setFlashSale(response.flashSale);
          setProducts(response.products);
          setTotalPages(response.totalPages);
          setPage(response.currentPage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, []);

  // Loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      {/* component info  */}
      <HomeComponentTitle
        title={flashSale?.name || ""}
        subtitle={flashSale?.description || ""}
      />

      {/* Product Cards Grid */}
      <div className="grid lg:grid-cols-8 md:grid-cols-4 sm:grid-cols-1 gap-2 w-[100%]">
        {products.map((product) => {
          return <ProductCardShowcase key={product.id} product={product} />;
        })}
      </div>
    </div>
  );
}

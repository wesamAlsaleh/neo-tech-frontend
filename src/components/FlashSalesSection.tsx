"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

// import services
import { displayFlashSale } from "@/services/sale-services";

// import types
import { FlashSale } from "@/types/sale";
import { Product } from "@/types/product";

// Import icons
import { icons } from "../../public/icons";

// import custom components
import HomeComponentTitle from "./HomeComponentTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import ProductsGridLayout from "./(layouts)/ProductsGridLayout";

export default function FlashSalesSection() {
  // pagination state
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(1);
  const [saleDuration, setSaleDuration] = useState<number>(1);

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
          setFlashSale(response.flashSaleInfo);
          setProducts(response.products);
          setTotalProducts(response.totalProducts);
          setPage(response.currentPage);
          setTotalPages(response.totalPages);
          setSaleDuration(response.duration);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFlashSale();
  }, [page]);

  // Loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If no active flash sales, don't show the section
  if (!flashSale || !products.length) {
    return null;
  }

  // Pagination control component to pass it to the title component
  function PaginationControl() {
    // If there is only one page, don't show the pagination control
    if (totalPages === 1) {
      return null;
    }

    // Pagination control
    return (
      <div className="flex items-center gap-x-1">
        {/* Previous Button */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`p-3 border rounded-full ${
            page === 1
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-orange-300 text-white"
          }`}
        >
          <Image
            src={icons.leftArrowIcon48.src}
            alt="left-arrow"
            width={20}
            height={20}
          />
        </button>

        {/* Next Button */}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`p-3 border rounded-full ${
            page === totalPages
              ? "bg-gray-200 cursor-not-allowed"
              : "bg-orange-300 text-white"
          }`}
        >
          <Image
            src={icons.rightArrowIcon48.src}
            alt="left-arrow"
            width={20}
            height={20}
          />
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* component info  */}
      <HomeComponentTitle
        title={flashSale?.name || ""}
        subtitle={flashSale?.description || ""}
        paginationControl={<PaginationControl />} // Pagination control
      />

      {/* Product Cards Grid */}
      <ProductsGridLayout products={products} />
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";

// import services
import { getBestSellingProducts } from "@/services/products-services";

// import types
import { Product } from "@/types/product";

// import custom components
import HomeComponentTitle from "./HomeComponentTitle";
import ProductCardShowcase from "@/components/ProductCardShowcase";

export default function BestSellingProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  // Navigation state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchSellingProducts = async () => {
      const serverResponse = await getBestSellingProducts(currentPage);

      // If the server response is successful, set the products state
      if (serverResponse.status) {
        setProducts(serverResponse.products);
        setTotalPages(serverResponse.paginationInfo?.totalPages);
      }
    };

    fetchSellingProducts();
  }, [currentPage]); // fetch products based on the current page

  // function to handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {/* component info  */}
      <HomeComponentTitle
        title=" Best Selling Products"
        subtitle="This Month"
        navigationButtons={true}
      />

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        {/* previous button */}
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Previous
        </button>

        {/* page info */}
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>

        {/* next button */}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Next
        </button>
      </div>

      {/* products container */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-[50%] ">
        {products.map((product) => {
          return <ProductCardShowcase key={product.id} product={product} />;
        })}
      </div>
    </>
  );
}

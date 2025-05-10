"use client";

import React, { useEffect, useState } from "react";

// import services
import { getBestSellingProducts } from "@/services/products-services";

// import types
import { Product } from "@/types/product";

// import custom components
import HomeComponentTitle from "./HomeComponentTitle";
import ProductCard from "@/components/ProductCard";
import ProductsGridLayout from "./(layouts)/ProductsGridLayout";

export default function BestSellingProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);

  // State to manage the loading state
  const [loading, setLoading] = useState(true);

  // Navigation state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Function to fetch best selling products from the server
  const fetchSellingProducts = async () => {
    try {
      // Call the server function to get the best selling products
      const serverResponse = await getBestSellingProducts(currentPage);

      // If the server response is successful, set the products state
      if (serverResponse.status) {
        setProducts(serverResponse.products);
        setTotalPages(serverResponse.paginationInfo?.totalPages);
      } else {
        // If the server response is not successful, set the products state to an empty array
        setProducts([]);

        // To make the loading skeleton appear in case of an error
        setLoading(true);
      }
    } catch (error) {
      // To make the loading skeleton appear in case of an error
      setLoading(true);
    } finally {
      // Set loading to false after fetching data
      setLoading(false);
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Fetch the user cart data from the server
      await fetchSellingProducts();
    };

    initFetch();
  }, [currentPage]);

  return (
    <>
      {/* component info  */}
      <HomeComponentTitle
        title=" Best Selling Products"
        subtitle="This Month"
        viewAllButton={true}
        url="/products?sortBy=bestSelling"
      />

      {/* Product Cards Grid */}
      <ProductsGridLayout products={products} isLoading={loading} />
    </>
  );
}

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

  // Fetch best selling products
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
        viewAllButton={true}
        url="/products"
      />

      {/* Product Cards Grid */}
      <div className="grid grid-cols-8 gap-2 w-[85%] ">
        {products.map((product) => {
          return <ProductCardShowcase key={product.id} product={product} />;
        })}
      </div>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// import services
import { getExploreProducts } from "@/services/products-services";

// import types
import { Product } from "@/types/product";

// import custom components
import HomeComponentTitle from "./HomeComponentTitle";
import ProductCard from "./ProductCard";
import ProductsGridLayout from "./(layouts)/ProductsGridLayout";

export default function ExploreProductsSection() {
  // Router instance
  const router = useRouter();

  // State to manage the loading state
  const [loading, setLoading] = useState(true);

  // State to manage products
  const [products, setProducts] = useState<Product[]>([]);

  // Function to fetch best selling products from the server
  const fetchExploreProducts = async () => {
    try {
      // Call the server function to get the best selling products
      const serverResponse = await getExploreProducts();

      // If the server response is successful, set the products state
      if (serverResponse.status) {
        setProducts(serverResponse.products);
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
      await fetchExploreProducts();
    };

    initFetch();
  }, []);

  return (
    <>
      <HomeComponentTitle
        title=" Explore Our Products"
        subtitle="Our Products"
      />

      {/* Product Cards Grid */}
      <ProductsGridLayout products={products} isLoading={loading} />

      {/*  View All Products Button */}
      <div className="flex justify-center mt-4">
        <button
          className="bg-primary text-white py-2 px-4 rounded-md font-bold text-wrap"
          onClick={() => router.push("/products")}
        >
          View All Products
        </button>
      </div>
    </>
  );
}

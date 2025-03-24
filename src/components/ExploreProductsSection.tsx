"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// import services
import { getExploreProducts } from "@/services/products-services";

// import types
import { Product } from "@/types/product";

// import custom components
import HomeComponentTitle from "./HomeComponentTitle";
import ProductCardShowcase from "./ProductCardShowcase";

export default function ExploreProductsSection() {
  // Router instance
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);

  // fetch all categories
  useEffect(() => {
    const fetchExploreProducts = async () => {
      const serverResponse = await getExploreProducts();

      if (serverResponse.status) setProducts(serverResponse.products);
    };

    fetchExploreProducts();
  }, []);

  return (
    <>
      <HomeComponentTitle
        title=" Explore Our Products"
        subtitle="Our Products"
      />

      {/* Product Cards Grid */}
      <div className="grid lg:grid-cols-9 md:grid-cols-4 sm:grid-cols-2 gap-2 w-[100%]">
        {products.map((product) => {
          return <ProductCardShowcase key={product.id} product={product} />;
        })}
      </div>

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

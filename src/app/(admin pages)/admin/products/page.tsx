"use client";

import React, { useEffect, useState } from "react";

// import types
import { Products } from "@/types/product";

// Services import
import { getProducts } from "@/services/products-services";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ManageProductsPage() {
  const [products, setProducts] = useState<[Products]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchProducts = getProducts();

      setProducts(await fetchProducts);

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <p>Here you can manage products</p>

        {loading && <LoadingSpinner />}
      </div>
    );
  }

  return (
    // Page Container to handle scrolling
    <div className="max-h-screen overflow-y-auto">
      {/* Layout container */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Products</h1>
        <p className="mb-8">Here you can manage products</p>

        {/* Products list container */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-4">
          {products?.map((product) => {
            return (
              // Product card container
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                <img
                  src={product.images[0] || "https://via.placeholder.com/150"}
                  alt={product.product_name}
                  className="w-full h-40 object-cover rounded-md"
                />
                {/* product title */}
                <h3 className="text-lg font-semibold mt-2">
                  {product.product_name}
                </h3>

                {/* product description */}
                <p className="text-gray-600 text-sm">
                  {product.product_description}
                </p>

                {/* price & rating container */}
                <div className="flex justify-between items-center mt-3">
                  {/* price section */}
                  <span className="text-xl font-bold">
                    ${product.product_price}
                  </span>

                  {/* rating section */}
                  <span className="text-yellow-500">
                    ⭐ {product.product_rating}
                  </span>
                </div>

                {/* Add to cart button */}
                <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition">
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

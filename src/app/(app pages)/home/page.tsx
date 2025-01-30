"use client";

import React, { useEffect, useState } from "react";

// Import custom components
import NavBar from "@/components/NavBar";

// Services import
import { getProducts } from "@/services/products-services";
import { getAllCategories } from "@/services/categories-services";

// import types
import { Products } from "@/types/product";
import { Categories } from "@/types/category";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";

export default function homePage() {
  // data state
  const [categories, setCategories] = useState<Categories[]>([]);
  const [products, setProducts] = useState<Products[]>([]);

  // loading state
  const [loading, setLoading] = useState<boolean>(true);

  // UI messages states
  const [categoryMessage, setCategoryMessage] = useState<string>("");
  const [productMessage, setProductMessage] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const fetchCategories = await getAllCategories();
      const fetchProducts = await getProducts();

      setCategories(fetchCategories.categories); // set the data to the state
      setCategoryMessage(fetchCategories.message); // set the message to the state

      setProducts(fetchProducts); // set the data to the state
      setProductMessage(fetchProducts.message); // set the message to the state

      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>{loading && <LoadingSpinner />}</div>;
  }

  return (
    <div className="max-h-screen overflow-y-auto px-4">
      {/* Navigation Bar */}
      <NavBar />

      {/* Main content */}
      <div>
        <h1 className="text-4xl font-bold text-center mt-10">
          All categories on neoTech
        </h1>

        {/* Categories */}
        <div className="flex flex-wrap justify-center mt-10">
          {categories?.map((category) => (
            <div
              key={category.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md gap-4 flex flex-col items-center mx-4 my-4"
            >
              <img
                src={category.category_image_url}
                alt={category.category_name}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <h2 className="text-xl font-bold mt-2">
                {category.category_name} Category
              </h2>
              <p className="text-gray-500 mt-2">
                {category.category_description}
              </p>
            </div>
          ))}
        </div>

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

        <p className="text-center mt-4 text-gray-500">
          The best tech shop in the world
        </p>
      </div>
    </div>
  );
}

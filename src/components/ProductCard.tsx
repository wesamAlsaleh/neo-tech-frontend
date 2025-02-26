"use client";

import React, { useState } from "react";
import Image from "next/image";

// import types
import { SingleProduct } from "@/types/product";

// import custom components

interface ProductCardProps {
  product: SingleProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Image index state

  // Handle previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product?.images.length! - 1 : prev - 1
    );
  };

  // Handle next image
  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product?.images.length! - 1 ? 0 : prev + 1
    );
  };

  // Handle thumbnail click event (change the current image index to the clicked thumbnail index)
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    //  Product card
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div className="flex flex-col space-y-4">
        <div className="relative h-96 w-full border rounded-lg overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[currentImageIndex]}
              alt={product.product_name}
              className="object-contain w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span>No image available</span>
            </div>
          )}

          {product.images && product.images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
                onClick={handlePrevImage}
              >
                &#10094;
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full"
                onClick={handleNextImage}
              >
                &#10095;
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {product.images && product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <div
                key={index}
                className={`h-16 w-16 border rounded cursor-pointer ${
                  currentImageIndex === index
                    ? "border-blue-500 border-2"
                    : "border-gray-300"
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">{product.product_name}</h1>

        <div className="flex items-center space-x-4">
          <span className="text-2xl font-semibold">
            ${parseFloat(product.product_price).toFixed(2)}
          </span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-xl">
                {i < Math.floor(product.product_rating) ? "★" : "☆"}
              </span>
            ))}
            <span className="ml-1 text-gray-600">
              ({product.product_rating})
            </span>
          </div>
        </div>

        <div className="py-2">
          <p className="text-gray-700">{product.product_description}</p>
        </div>

        <div className="flex items-center space-x-4 py-2">
          <span
            className={`px-3 py-1 rounded-full ${
              product.product_stock > 0
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.product_stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
          <span className="text-gray-600">Views: {product.product_view}</span>
          <span className="text-gray-600">Sold: {product.product_sold}</span>
        </div>

        <div className="pt-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-md">
              <button className="px-3 py-2 text-xl border-r">-</button>
              <input
                type="number"
                className="w-12 text-center py-2"
                min="1"
                max={product.product_stock}
                defaultValue="1"
              />
              <button className="px-3 py-2 text-xl border-l">+</button>
            </div>
            <button
              className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
                product.product_stock === 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={product.product_stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>

        <div className="pt-4 border-t mt-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Category:</div>
            <div>{product.category_id.category_name} Category</div>

            <div className="text-gray-600">Barcode:</div>
            <div>{product.product_barcode}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

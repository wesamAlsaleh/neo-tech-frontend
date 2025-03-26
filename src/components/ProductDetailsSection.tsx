"use client";

import React, { useState } from "react";
import Image from "next/image";

// import useAuth hook from the AuthContext
import { useAuth } from "@/contexts/AuthContext";

// import types and functions from the product file
import { SingleProduct } from "@/types/product";

// import helper functions
import { convertPriceToBHD } from "@/lib/helpers";
import RatingStars from "./RatingStars";

// import custom components

interface ProductCardProps {
  product: SingleProduct;
}

export default function ProductDetailsSection({ product }: ProductCardProps) {
  // Get the user from the auth context to check if the user is logged in
  const { user } = useAuth();

  // State to store the current image index
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
    // Product details page layout
    <div className="flex space-x-8">
      {/* Left Section: Thumbnails + Main Image */}
      <div className="flex space-x-4">
        {/* Thumbnails (Stacked Vertically) */}
        <div className="flex flex-col space-y-2">
          {product.images &&
            product.images.length > 1 &&
            product.images.map((image, index) => (
              <div
                key={index}
                className={`h-40 w-40 border rounded cursor-pointer ${
                  currentImageIndex === index
                    ? "border-orange-500 border-2"
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

        {/* Main Image */}
        <div className="relative h-[665px] w-[665px] border rounded-lg overflow-hidden">
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
        </div>
      </div>

      {/* Right Section: Product Details */}
      <div className="flex flex-col space-y-4 w-96">
        {/* Product Details Container */}
        <div className="flex flex-col space-y-2">
          {/* Product Name */}
          <h1 className="text-black">{product.product_name}</h1>

          {/* Product Rating + Stock Status Container */}
          <div className="flex flex-row">
            {/* Product Rating */}
            <RatingStars key={product.id} rating={product.product_rating} />

            {/* Product Stock */}
            <span className="text-gray-500">
              {product.product_stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Product Price */}
          <h3 className="mb-4">{convertPriceToBHD(product.product_price)}</h3>

          {/* Product Description */}
          <p>{product.product_description}</p>
        </div>

        {/* Actions Container */}
        <div></div>

        {/* Badges (Static) */}
        <div></div>
      </div>
    </div>
  );
}

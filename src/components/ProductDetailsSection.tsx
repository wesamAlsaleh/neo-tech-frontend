"use client";

import React, { useState } from "react";
import Image from "next/image";

// import types and functions from the product file
import { SingleProduct } from "@/types/product";

// import helper functions
import { convertPriceToBHD } from "@/lib/helpers";

// import custom components
import RatingStars from "./RatingStars";

interface ProductCardProps {
  product: SingleProduct;
}

export default function ProductDetailsSection({ product }: ProductCardProps) {
  // State to store the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Image index state

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
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                  width={160} // Image width is 160px (fixed) to maintain the aspect ratio
                  height={160} // Image height is 160px (fixed) to maintain the aspect ratio
                />
              </div>
            ))}
        </div>

        {/* Main Image */}
        <div className="relative h-[665px] w-[665px] border rounded-lg overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[currentImageIndex]}
              alt={product.product_name}
              className="object-contain w-full h-full"
              width={665} // Image width is 665px (fixed) to maintain the aspect ratio
              height={665} // Image height is 665px (fixed) to maintain the aspect ratio
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span>No image available</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Product Details */}
      <div className="flex flex-col space-y-4 w-full">
        {/* Product Details Container */}
        <div className="flex flex-col space-y-3">
          {/* Product Name */}
          <h1 className="text-black text-3xl">{product.product_name}</h1>

          {/* Product Rating + Stock Status Container */}
          <div className="flex flex-row">
            {/* Product Rating */}
            <RatingStars key={product.id} rating={product.product_rating} />

            <span className="mx-3 font-bold">|</span>

            {/* Product Stock */}
            <span className="text-gray-500 text-lg">
              {product.product_stock > 5 ? (
                <span className="text-green-500">In Stock</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </span>
          </div>

          {/* Product Price */}
          <h3 className="text-2xl ">
            {convertPriceToBHD(product.product_price)}
          </h3>

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

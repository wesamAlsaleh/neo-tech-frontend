"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// import icons
import { icons } from "../../public/icons";

// import types and functions from the product file
import { SingleProduct } from "@/types/product";

// Import backend services
import { addProductToWishlist } from "@/services/wishlist-services";
import { addProductToCart } from "@/services/cart-services";

// import helper functions
import { convertPriceToBHD } from "@/lib/helpers";

// import custom components
import RatingStars from "./RatingStars";
import Separator from "./Separator";

interface ProductCardProps {
  product: SingleProduct;
}

export default function ProductDetailsSection({ product }: ProductCardProps) {
  // State to store the quantity of the product
  const [quantity, setQuantity] = useState<number>(1); // Quantity state

  // State to store the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0); // Image index state

  // Handle thumbnail click event (change the current image index to the clicked thumbnail index)
  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle add to wishlist event
  const handleAddToWishlist = async (productId: number) => {
    // request to add product to wishlist
    const response = await addProductToWishlist(productId);

    // message alert
    alert(response.message);
  };

  // Handle add to cart event
  const handleAddToCart = async (productId: number, quantity: number) => {
    // request to add product to cart
    const response = await addProductToCart(String(productId), quantity);

    // message alert
    alert(response.message);
  };

  return (
    // Product details page layout
    <div className="flex space-x-8">
      {/* Left Section: Thumbnails + Main Image + Static Badges */}
      <div className="flex flex-col space-y-4">
        {/* Top Section: Thumbnails + Main Image Container */}
        <div className="flex flex-row space-x-4">
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

        {/* Down Section: Badges Container (Static) */}
        <div className="flex flex-col gap-y-4 p-4 border border-gray-400 rounded-md w-full">
          {/* Free Delivery Badge Container*/}
          <div className="flex items-start gap-3">
            {/* Icon */}
            <Image
              src={icons.deliveryIcon48}
              alt="Delivery Icon"
              width={45}
              height={45}
            />

            {/* Text */}
            <div>
              {/* Main text */}
              <h4 className="font-bold text-gray-900">Free Delivery</h4>

              {/* Subtext */}
              <p className="text-sm text-gray-600 mt-1 font-medium">
                Enter your Address for Delivery Availability.
              </p>
            </div>
          </div>

          {/* Horizontal Divider */}
          <hr className="border-t border-gray-400 my-1" aria-hidden="true" />

          {/* Return Policy Badge Container*/}
          <div className="flex items-start gap-3">
            {/* Icon */}
            <Image
              src={icons.refundIcon48}
              alt="Delivery Icon"
              width={45}
              height={45}
            />

            <div>
              {/* Main text */}
              <h4 className="font-bold text-gray-900">Return Delivery</h4>

              {/* Subtext */}
              <p className="text-sm text-gray-600 mt-1">
                Free 30 Days Delivery Returns.{" "}
                <Link href="#" className="underline hover:text-orange-500">
                  Details
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section: Product Details */}
      <div className="flex flex-col space-y-6 w-full">
        {/* Product Details Container */}
        <div className="flex flex-col space-y-4">
          {/* Product Name */}
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {product.product_name}
          </h1>

          {/* Product Rating + Stock Status Container */}
          <div className="flex flex-row">
            {/* Product Rating */}
            <RatingStars key={product.id} rating={product.product_rating} />

            <span className="mx-3 font-bold text-black">|</span>

            {/* Stock Status */}
            <span
              className={`text-lg font-medium ${
                product.product_stock > 5 ? "text-green-600" : "text-red-600"
              }`}
            >
              {/*  */}
              {product.product_stock > 5 ? "In Stock" : "Out of Stock"}

              {/* Show stock if its between 5 to 20 only*/}
              {product.product_stock > 5 && product.product_stock <= 20 && (
                <span className="text-gray-500 text-sm ml-1">
                  (Only {product.product_stock} left)
                </span>
              )}
            </span>
          </div>

          {/* Product Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              {product.onSale
                ? convertPriceToBHD(product.product_price_after_discount)
                : convertPriceToBHD(product.product_price)}
            </span>

            {product.onSale ? (
              <span className="text-lg text-gray-500 line-through">
                {convertPriceToBHD(product.product_price)}
              </span>
            ) : null}
          </div>

          {/* Product Description */}
          <div className="text-lg text-gray-700">
            {product.product_description}
          </div>
        </div>

        {/* Separator */}
        <Separator
          thickness="border-t"
          color="border-gray-400"
          width="w-full"
        />

        {/* Actions Container */}
        <div className="flex flex-row items-center gap-4">
          {/* Quantity Buttons Container */}
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
            {/* Decrease Button */}
            <button
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-lg transition-colors duration-200"
              onClick={() => setQuantity(quantity - 1)}
            >
              -
            </button>

            {/* Quantity Counter */}
            <span className="px-4 py-2 text-gray-800 font-semibold border-x border-gray-300">
              {quantity || 1}
            </span>

            {/* Increase Button */}
            <button
              className="px-4 py-2 bg-orange-100 hover:bg-orange-200 text-gray-800 font-medium text-lg transition-colors duration-200"
              onClick={() => setQuantity(quantity + 1)}
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            className="flex-1 flex items-center justify-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 min-w-[150px]"
            onClick={() => handleAddToCart(product.id, quantity)}
          >
            <span>Add to Cart</span>
          </button>

          {/* Wishlist Button */}
          <button
            className="p-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
            onClick={() => handleAddToWishlist(product.id)}
          >
            <Image
              src={icons.outlineHeartIcon48}
              alt="Wishlist Icon"
              width={24}
              height={24}
              className="opacity-80 hover:opacity-100 transition-opacity"
            />
          </button>
        </div>
      </div>
    </div>
  );
}

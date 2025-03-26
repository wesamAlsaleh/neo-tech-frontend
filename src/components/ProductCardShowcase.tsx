"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// import types
import { Product } from "@/types/product";

// import helper functions
import { convertPriceToBHD, convertSalePercentage } from "@/lib/helpers";

// Import backend services
import {
  addProductToWishlist,
  removeProductFromWishlistByProductId,
} from "@/services/wishlist-services";

// import custom components

interface ProductCardShowcaseProps {
  product: Product;
  isWishlist?: boolean; // Optional prop to show wishlist icon if true
}

export default function ProductCardShowcase(props: ProductCardShowcaseProps) {
  const { product, isWishlist } = props;

  // Handle adding product to wishlist
  const handleAddToWishlist = async (productId: number) => {
    // request to add product to wishlist
    const response = await addProductToWishlist(productId);

    // message alert
    alert(response.message);
  };

  // Handle removing product from wishlist
  const handleRemoveFromWishlist = async (productId: number) => {
    // request to remove product from wishlist
    const response = await removeProductFromWishlistByProductId(productId);

    // message alert
    alert(response.message);

    // reload the page after 1 sec to reflect the changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    // product container
    <div className="relative p-4 bg-white shadow-lg rounded-lg">
      {product.onSale ? (
        // Discount Badge container
        <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
          {`${convertSalePercentage(product.discount)}`}
        </div>
      ) : null}

      {/* Wishlist & View Icons container */}
      <div className="absolute top-3 right-3 flex flex-col space-y-2">
        {/* whishlist button */}
        {isWishlist ? (
          <button
            onClick={() => handleRemoveFromWishlist(product.id)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-200"
          >
            🗑️
          </button>
        ) : (
          <button
            onClick={() => handleAddToWishlist(product.id)}
            className="p-2 bg-white rounded-full shadow hover:bg-gray-200"
          >
            ❤️
          </button>
        )}

        {/* view product button */}
        {/* <button
          className="p-2 bg-white rounded-full shadow hover:bg-gray-200"
          onClick={() => router.push(`/products/${product.slug}`)}
        >
          👁️
        </button> */}
      </div>

      {/* Product Image container */}
      <div className="flex items-center justify-center">
        <Link href={`/products/${product.slug}`}>
          <img
            src={String(product.images[0])}
            alt={product.product_name}
            className="w-48 h-48 object-cover rounded-lg"
          />
        </Link>
      </div>

      {/* Product Details container */}
      <div className="mt-3">
        {/* product name */}
        <h3 className="text-lg font-semibold">{product.product_name}</h3>

        {/* product price container */}
        <div className="flex items-center space-x-2">
          <p className="text-gray-500 font-bold">
            {product.onSale ? (
              <span className="text-orange-500">
                {convertPriceToBHD(product.product_price_after_discount)}
              </span>
            ) : (
              convertPriceToBHD(product.product_price)
            )}
          </p>
        </div>

        {/* product rating container */}
        <div className="flex items-center space-x-1 mt-1 text-yellow-500">
          ⭐{product.product_rating}
        </div>
      </div>
    </div>
  );
}

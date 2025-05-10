"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// import types
import { Product } from "@/types/product";

// import helper functions
import { convertPriceToBHD, convertSalePercentage } from "@/lib/helpers";

// Import backend services
import {
  addProductToWishlist,
  removeProductFromWishlistByProductId,
} from "@/services/wishlist-services";

// import custom hooks
import { useAuth } from "@/contexts/AuthContext";

// import icons
import { icons } from "../../public/icons";

// import custom components
import RatingStars from "./RatingStars";

interface ProductCardProps {
  product: Product;
  isWishlistCard?: boolean; // Optional prop to show wishlist icon if true
}

export default function ProductCard(props: ProductCardProps) {
  const { product, isWishlistCard } = props;

  // Import the auth context to get the user data and user setters
  const { setUserWishlistCount } = useAuth();

  // Handle adding product to wishlist
  const handleAddToWishlist = async (productId: number) => {
    // request to add product to wishlist
    const response = await addProductToWishlist(productId);

    if (response.status) {
      setUserWishlistCount(response.wishlistItemsCount);
    }

    // message alert
    alert(response.message);
  };

  // Handle removing product from wishlist
  const handleRemoveFromWishlist = async (productId: number) => {
    // request to remove product from wishlist
    const response = await removeProductFromWishlistByProductId(productId);

    // message alert
    alert(response.message);

    // update the wishlist count in the auth context
    if (response.status) {
      setUserWishlistCount(response.wishlistItemsCount);
    }

    // reload the page after 1 sec to reflect the changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    // product container
    <div className="relative p-4 rounded-lg flex flex-col justify-between bg-gray-50 hover:shadow-md transition-shadow duration-300 ease-in-out h-full">
      {/* Discount Badge */}
      {product.onSale ? (
        <div className="absolute top-2 left-2 sm:top-2 sm:left-2 md:top-3 md:left-3 lg:top-3 lg:left-3 bg-red-500 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-md">
          {`${convertSalePercentage(product.discount)}`}
        </div>
      ) : null}

      {/* Wishlist & View Icons container */}
      <div className="absolute top-2 right-2 sm:top-2 sm:right-2 md:top-3 md:right-3 lg:top-3 lg:right-3 flex flex-col space-y-2">
        {/* remove whishlist product button */}
        {isWishlistCard ? (
          <button
            onClick={() => handleRemoveFromWishlist(product.id)}
            className="p-2 bg-red-50 rounded-full shadow hover:bg-red-200"
          >
            <Image
              src={icons.removeAsTrashIcon48}
              alt="wishlist"
              width={22}
              height={22}
            />
          </button>
        ) : (
          // add to wishlist button
          <button
            onClick={() => handleAddToWishlist(product.id)}
            className="p-2 rounded-full shadow hover:bg-orange-50"
          >
            <Image
              src={icons.outlineHeartIcon48}
              alt="wishlist"
              width={22}
              height={22}
            />
          </button>
        )}
      </div>

      {/* Product Image container */}
      <div className="flex items-center justify-center">
        <Link href={`/products/${product.slug}`}>
          <img
            src={String(product.images[0])}
            alt={product.product_name}
            className="w-52 h-52 object-cover rounded-lg"
          />
        </Link>
      </div>

      {/* Product Details container */}
      <div className="mt-3">
        {/* product name */}
        <h3 className="text-base text-left font-sans font-bold h-12 overflow-hidden line-clamp-2">
          {product.product_name}
        </h3>

        {/* product price container */}
        <div className="flex flex-col items-start mt-2">
          {product.onSale ? (
            <p className="text-red-500 font-bold">
              {convertPriceToBHD(product.product_price)}
              <span className="line-through text-gray-400 ml-2">
                {convertPriceToBHD(product.product_price)}
              </span>
            </p>
          ) : (
            <p className="text-gray-500 font-bold">
              {convertPriceToBHD(product.product_price)}
            </p>
          )}

          {/* Product Rating Stars container */}
          <div className="w-4 h-4">
            {/* Rating Starts */}
            <RatingStars rating={product.product_rating} key={product.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

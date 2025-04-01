"use client";

import React, { useEffect, useState } from "react";

// Import types
import { Wishlist } from "@/types/wishlist";
import { Product } from "@/types/product";
import { User } from "@/types/user";

// Import services
import { getUserWishlist } from "@/services/wishlist-services";

// Import auth context which provides user data
import { useAuth } from "@/contexts/AuthContext";

// Import components
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";

export default function page() {
  // Get the user data from the auth context
  const { user } = useAuth() as { user: User };

  // State to store user wishlist data (array of products)
  const [userWishlistProducts, setUserWishlistProducts] = useState<Product[]>();

  // State to store the count of products in the user's wishlist
  const [userWishlistProductsCount, setUserWishlistProductsCount] =
    useState<number>();

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch data from server
  useEffect(() => {
    try {
      // setLoading to true
      setLoading(true);

      // Fetch user wishlist data
      const fetchUserWishlist = async () => {
        const response = await getUserWishlist();

        // Update UI with the server response
        setServerResponse({
          status: response.status,
          message: response.message,
        });

        // If the response status is false, return early
        if (!response.status) {
          return;
        }

        // Update the userWishlist state
        setUserWishlistProducts(response.products);
        setUserWishlistProductsCount(response.productsCount);
      };

      fetchUserWishlist();
    } finally {
      setLoading(false);
    }
  }, []);

  // If the loading status is true, display a loading message
  if (loading) {
    return <LoadingSpinner />;
  }

  // If the user is not authenticated, display a message
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-semibold text-gray-500">
          Please login to see your wishlist
        </h1>
      </div>
    );
  }

  return (
    <>
      {/* Header Container */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-500 mb-4">
          Your Wishlist ({userWishlistProductsCount})
        </h1>

        {/* Add to cart button */}
        <button
          className="px-6 py-3 border border-gray-500 text-black rounded"
          onClick={() => {
            // Add all products to the cart
          }}
        >
          Move All To Bag
        </button>
      </div>

      {/* Display error message if something is wrong */}
      {serverResponse.message && !serverResponse.status && (
        <div
          className={`px-4 py-3 rounded relative mb-4 ${
            serverResponse.status
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          {serverResponse.status ? (
            <strong className="font-bold">Success! </strong>
          ) : (
            <strong className="font-bold">Error! </strong>
          )}
          <span className="block sm:inline">{serverResponse.message}</span>
        </div>
      )}

      {/* If no Items in the cart */}
      {userWishlistProducts && userWishlistProducts.length === 0 && (
        // Message Container
        <div className="flex items-center justify-center h-[50vh]">
          <h1 className="text-2xl font-semibold text-gray-500">
            Your wishlist is empty
          </h1>
        </div>
      )}

      {/* Product Cards Grid */}
      <div className="grid lg:grid-cols-8 md:grid-cols-4 sm:grid-cols-1 gap-2 w-[100%] ">
        {userWishlistProducts &&
          userWishlistProducts.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={product}
                isWishlist // to remove the wishlist button
              />
            );
          })}
      </div>
    </>
  );
}

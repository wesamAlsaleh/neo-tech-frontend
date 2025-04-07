"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

// Import types
import { Wishlist } from "@/types/wishlist";
import { Product } from "@/types/product";
import { User } from "@/types/User";

// Import services
import { getUserWishlist, moveToCart } from "@/services/wishlist-services";

// Import auth context which provides user data
import { useAuth } from "@/contexts/AuthContext";

// Import components
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";

export default function page() {
  // Get the user data from the auth context
  const {
    user,
    setUserWishlistCount,
    userWishlistCount,
    setUserCartItemsCount,
  } = useAuth();

  // State to store user wishlist data (array of products)
  const [userWishlistProducts, setUserWishlistProducts] = useState<Product[]>();

  // State to store the count of products in the user's wishlist
  // const [userWishlistProductsCount, setUserWishlistProductsCount] =
  //   useState<number>(0);

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch user wishlist data
  const fetchUserWishlist = async () => {
    const response = await getUserWishlist();

    // Update UI with the server response
    setServerResponse({
      status: response.status,
      message: "",
    });

    // If the response status is false, return early
    if (!response.status) {
      // Update UI with the server response
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      return;
    }

    // Update the userWishlist state
    setUserWishlistProducts(response.products);
    setUserWishlistCount(response.wishlistItemsCount);
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the user cart data from the server
      await fetchUserWishlist();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, []);

  // Handle move to cart action
  const handleMoveToCart = async () => {
    const response = await moveToCart();

    // Update UI with the server response
    setServerResponse({
      status: response.status,
      message: response.message,
    });

    // If the response status is successful, update the user cart count
    if (response.status) {
      setUserCartItemsCount(response.cartItemsCount);
    }
  };

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

        <h3>
          <Link href="/login" className="text-orange-500 underline ml-2">
            Login
          </Link>
        </h3>
      </div>
    );
  }

  return (
    <>
      {/* Header Container */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-500 mb-4">
          Your Wishlist ({userWishlistCount})
        </h1>

        {/* Add to cart button */}
        <button
          className="px-6 py-3 border border-gray-500 text-black rounded"
          onClick={() => handleMoveToCart()}
        >
          Move All To Bag
        </button>
      </div>

      {/* Display error message if something is wrong */}
      {serverResponse.message && (
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

"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Import types
import { CartItem } from "@/types/cart";
import { User } from "@/types/user";

// Import services
import {
  getUserCart,
  removeProductFromCart,
  updateCart,
} from "@/services/cart-services";

// Import auth context which provides user data
import { useAuth } from "@/contexts/AuthContext";

// Import components
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductCard from "@/components/ProductCard";
import { convertPriceToBHD } from "@/lib/helpers";
import { icons } from "../../../../public/icons";

export default function page() {
  // Get the user data from the auth context
  const { user } = useAuth() as { user: User };

  // State to store user wishlist data (array of products)
  const [userCart, setUserCart] = useState<CartItem[] | undefined>();

  // State to store the count of products in the user's wishlist
  const [userCartItemsCount, setUserCartItemsCount] = useState<number>(0);

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the loading skeleton status
  const [loadingSkeleton, setLoadingSkeleton] = useState<boolean>(false);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch user cart data from the server
  const fetchUserCart = async () => {
    // Call the getUserCart function to fetch the user's cart data
    const response = await getUserCart();

    // Update UI with the server response
    setServerResponse({
      status: response.status,
      message: response.message,
    });

    if (response.status) {
      // Update the userWishlist state
      setUserCart(response.cartItems);
      setUserCartItemsCount(response.totalItemsInCart);
    }
  };

  // Fetch data from server
  useEffect(() => {
    try {
      // setLoading to true
      setLoading(true);

      fetchUserCart();
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle the quantity change in the cart item
  const handleQuantityChange = async (
    cartItemId: string,
    newQuantity: number
  ) => {
    try {
      setLoadingSkeleton(true);

      // Request to update the cart item quantity in the server
      const response = await updateCart(cartItemId, newQuantity);

      setServerResponse({
        status: response.status,
        message: response.message,
      });

      // Refetch the cart data to reflect the changes
      if (response.status) {
        fetchUserCart();
      }
    } finally {
      setLoadingSkeleton(false);
    }
  };

  // Handle the remove item from cart
  const handleRemoveItem = async (cartItemId: string) => {
    try {
      setLoading(true);

      // Request to remove the cart item from the server
      const response = await removeProductFromCart(cartItemId);

      setServerResponse({
        status: response.status,
        message: response.message,
      });

      // Refetch the cart data to reflect the changes
      if (response.status) {
        fetchUserCart();
      }
    } finally {
      setLoading(false);
    }
  };

  // If the loading status is true, display a loading message
  if (loading) {
    return <LoadingSpinner />;
  }

  // If the user is not logged in, display a message
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <h1 className="text-2xl font-semibold text-gray-500 mb-4">
          Please login to view your cart
        </h1>

        <p className="text-gray-500 mb-4">
          You need to login to view your cart items and checkout.
        </p>

        <Link
          href="/login"
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header Container */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-500 mb-4">
          Your Cart ({userCartItemsCount})
        </h1>

        {/* Add to cart button */}
        <button className="px-6 py-3 border border-gray-500 text-black rounded">
          <Link href="/home">Return To Shop</Link>
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
      {userCart && userCart.length === 0 && (
        // Message Container
        <div className="flex flex-col items-center justify-center h-[50vh]">
          {/* Text */}
          <h1 className="text-2xl font-semibold text-gray-500 mb-4">
            Your Cart is empty
          </h1>

          {/* Link */}
          <Link
            href="/home"
            className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
          >
            Return To Home Page
          </Link>
        </div>
      )}

      {/* Cart Table */}
      {userCart && userCart.length > 0 && (
        <>
          {/* Table container */}
          <div>
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-4 text-left">Product</th>
                  <th className="py-3 px-4 text-center">Price</th>
                  <th className="py-3 px-4 text-center">Quantity</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                  <th className="py-3 px-4 text-right"></th>
                </tr>
              </thead>

              <tbody>
                {loadingSkeleton ? (
                  <>
                    {/* Show skeletons based on the item counts */}

                    {Array.from({ length: userCartItemsCount || 1 }).map(
                      // Array.from creates an array of a given length
                      (_, index) => (
                        <CartItemSkeleton key={index} />
                      )
                    )}
                  </>
                ) : (
                  userCart.map((cartItem) => (
                    <tr
                      key={cartItem.product.id}
                      className="border-t border-gray-200 group relative"
                    >
                      {/* Item Name and Image */}
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <Image
                            src={cartItem.product.images[0]}
                            alt={cartItem.product.product_name}
                            className="w-16 h-16 object-cover mr-4"
                            width={70}
                            height={70}
                          />
                          <span className="font-medium">
                            {cartItem.product.product_name}
                          </span>
                        </div>
                      </td>

                      {/* Item Price */}
                      <td className="py-4 px-4 text-center">
                        {convertPriceToBHD(String(cartItem.unit_price))}
                      </td>

                      {/* Quantity Input */}
                      <td className="py-4 px-4 text-center">
                        <input
                          type="number"
                          min="1"
                          value={cartItem.quantity}
                          className="w-16 h-8 border border-gray-300 rounded text-center"
                          onChange={(e) =>
                            handleQuantityChange(
                              String(cartItem.cart_item_id),
                              parseInt(e.target.value)
                            )
                          }
                        />
                      </td>

                      {/* Subtotal */}
                      <td className="py-4 px-4 text-right">
                        {convertPriceToBHD(String(cartItem.total_price))}
                      </td>

                      {/* Remove Item Button  */}
                      <td className="absolute top-1/2 -translate-y-1/2 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer  ">
                        <button
                          onClick={() =>
                            handleRemoveItem(cartItem.cart_item_id)
                          }
                        >
                          <Image
                            src={icons.removeAsTrashIcon48.src}
                            alt={`remove ${cartItem.product.product_name} from cart`}
                            width={24}
                            height={24}
                          />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}

function CartItemSkeleton() {
  return (
    <tr className="border-t border-gray-200 animate-pulse">
      {/* Item Name and Image Skeleton */}
      <td className="py-4 px-4">
        <div className="flex items-center">
          {/* Image Skeleton */}
          <div className="w-16 h-16 bg-gray-200 rounded mr-4"></div>
          {/* Name Skeleton */}
          <div className="h-5 w-48 bg-gray-200 rounded"></div>
        </div>
      </td>

      {/* Price Skeleton */}
      <td className="py-4 px-4 text-center">
        <div className="h-5 w-16 bg-gray-200 rounded mx-auto"></div>
      </td>

      {/* Quantity Input Skeleton */}
      <td className="py-4 px-4 text-center">
        <div className="h-8 w-16 bg-gray-200 rounded mx-auto"></div>
      </td>

      {/* Subtotal Skeleton */}
      <td className="py-4 px-4 text-right">
        <div className="h-5 w-20 bg-gray-200 rounded ml-auto"></div>
      </td>
    </tr>
  );
}

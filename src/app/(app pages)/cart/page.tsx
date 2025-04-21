"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Import types
import { CartItem } from "@/types/cart";

// Import services
import {
  getCartSummary,
  getUserCart,
  removeProductFromCart,
  updateCart,
} from "@/services/cart-services";
import { checkout } from "@/services/order-services";

// Import auth context which provides user data
import { useAuth } from "@/contexts/AuthContext";

// Import components
import LoadingSpinner from "@/components/LoadingSpinner";

// Import helpers
import { convertPriceToBHD } from "@/lib/helpers";

// Import icons
import { icons } from "../../../../public/icons";

export default function page() {
  // Get the user data from the auth context
  const { user, setUserCartItemsCount, userCartItemsCount } = useAuth();

  // Router instance
  const router = useRouter();

  // State to store user wishlist data (array of objects that contain product data)
  const [userCart, setUserCart] = useState<CartItem[]>([]);

  // State to store the cart summary data (total price for now)
  const [totalPrice, setTotalPrice] = useState<number>(0);

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the loading skeleton status
  const [loadingSkeleton, setLoadingSkeleton] = useState<boolean>(false);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // State to store the payment method (default is cash)
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");

  // Fetch user cart data from the server
  const fetchUserCart = async () => {
    // Request to get the user cart data and summary from the server
    const [cartResponse, cartSummaryResponse] = await Promise.all([
      getUserCart(),
      getCartSummary(),
    ]);

    // Update UI with the server response
    setServerResponse({
      status: cartResponse.status,
      message: cartResponse.message,
    });

    if (cartResponse.status) {
      // Convert the cart items to an array of objects
      const cartItemsArray = Object.values(cartResponse.cartItems || {});

      // Update the userWishlist state
      setUserCart(cartItemsArray as CartItem[]);

      // Overwrite the userCartItemsCount state with the new count (almost useless)
      setUserCartItemsCount(cartResponse.totalItemsInCart);
    }

    // Update the cart summary state or show error message
    if (cartSummaryResponse.status) {
      setTotalPrice(cartSummaryResponse.totalPrice);
    } else {
      setServerResponse({
        status: cartSummaryResponse.status,
        message: cartSummaryResponse.message,
      });
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the user cart data from the server
      await fetchUserCart();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
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
        // Update the userCart state
        setUserCartItemsCount(response.totalItemsInCart);

        // Update the userCart state
        fetchUserCart();
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle checkout button click
  const handleCheckout = async (paymentMethod: string) => {
    // Request to checkout the cart items
    const response = await checkout(paymentMethod);

    setServerResponse({
      status: response.status,
      message: response.message,
    });

    // If checkout is successful, redirect to the order details page
    if (response.status) {
      // Set the user cart items count to 0
      setUserCartItemsCount(0);

      // Refresh the user cart data
      await fetchUserCart();

      // Redirect to the order details page
      router.push(`/my-orders/${response.orderUUID}`);
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
        <Link href="/home">
          <button className="px-6 py-3 border border-gray-500 text-black rounded-lg hover:bg-orange-100 transition">
            Return To Shop
          </button>
        </Link>
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
        // Table container
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
                    key={cartItem.cart_item_id}
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
                        <Link href={`/products/${cartItem.product.slug}`}>
                          <span className="font-medium hover:text-orange-500 transition duration-200">
                            {cartItem.product.product_name}
                          </span>
                        </Link>
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
                        onClick={() => handleRemoveItem(cartItem.cart_item_id)}
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
      )}

      {/* Cart Summary */}
      {userCart && userCart.length > 0 && (
        // Summary Container
        <div className="mt-6 flex justify-center ">
          {/* Summary Box */}
          <div className="bg-gray-100 p-4 rounded shadow-md w-1/3 border border-gray-200 pt-4">
            <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>

            {/* Total Price Row*/}
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{convertPriceToBHD(String(totalPrice))}</span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between mb-2">
              <span>Payment Method:</span>
              <span className="text-black capitalize">{paymentMethod}</span>
            </div>

            {/* Payment Method Container*/}
            <div className="mb-4">
              {/* Label */}
              <p className="mb-2 font-semibold">Select Payment Method:</p>

              {/* Radio Buttons for Payment Methods */}
              <div className="flex gap-6 flex-wrap">
                {/* Option 1 */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="cash"
                    value="cash"
                    className="mr-1"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    defaultChecked
                  />
                  Cash
                </label>

                {/* Option 2 */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="creditCard"
                    value="credit_card"
                    className="mr-1"
                    disabled
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit Card
                </label>

                {/* Option 3 */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="debitCard"
                    value="debit_card"
                    className="mr-1"
                    disabled
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Debit Card
                </label>

                {/* Option 4 */}
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="paypal"
                    value="paypal"
                    className="mr-1"
                    disabled
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  PayPal
                </label>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              className="w-full mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              onClick={() => handleCheckout(paymentMethod)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
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

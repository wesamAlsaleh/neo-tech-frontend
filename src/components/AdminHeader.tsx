"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

// import types
import { Product } from "@/types/product"; // Importing the Product type from types folder
import { User } from "@/types/User"; // Importing the User type from types folder
import { Order } from "@/types/order";

// import backend services
import { globalSearch } from "@/services/dashboard-services";

// import helpers
import { convertPriceToBHD, formatDateTime } from "@/lib/helpers";

// import icons
import { icons } from "../../public/icons";

// import debounce hook to avoid too many API calls via search input
import { useDebounce } from "@/lib/hooks";

type SectionProps = {
  title: string;
  count: number;
  children: React.ReactNode;
};

export default function AdminHeader() {
  const [searchValue, setSearchValue] = useState<string>(""); // State to store the search value
  const [searchResults, setSearchResults] = useState<{
    counts: {
      users: number;
      orders: number;
      products: number;
    };
    users: User[]; // array of user objects
    orders: Order[]; // array of order objects
    products: Product[]; // array of product objects
  }>({
    counts: {
      users: 0,
      orders: 0,
      products: 0,
    },
    users: [],
    orders: [],
    products: [],
  }); // State to store the search results
  const [isSearching, setIsSearching] = useState<boolean>(false); // State to track if a search is in progress
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // State to store the server response
  const searchContainerRef = useRef<HTMLDivElement>(null); // Create a ref for the search container to handle clicks outside of it
  const [openSearchResults, setOpenSearchResults] = useState(false); // State to track if the search results are open
  const debouncedSearchTerm = useDebounce(searchValue, 300); // Set debounced search term to avoid too many API calls

  // Function to Close the search results when clicking outside of it
  const handleClickOutside = (event: MouseEvent) => {
    // Check if we have a valid ref (click event) and if the click was outside our component
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node)
    ) {
      setOpenSearchResults(false);
    }
  };

  // Use effect to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedSearchTerm) return;

      // Set loading to true while fetching data
      setIsSearching(true);

      // Call the API to get the products based on the search term
      const response = await globalSearch(debouncedSearchTerm);

      // Set loading to false after fetching data
      setIsSearching(false);

      // Update the UI state with the response
      setServerResponse({
        status: response.status,
        message: !response.status && response.message, // show error message only if the response is not successful
      });

      if (response.status) {
        setSearchResults(response.searchResults!); // Update the search results with the response data
        setOpenSearchResults(true); // Open the search results
        // console.log(searchResults); // Debugging line to check the search results
      }
    };

    fetchData();
  }, [debouncedSearchTerm]);

  // Use effect to close the search results when the search value is empty
  useEffect(() => {
    if (searchValue === "") {
      setOpenSearchResults(false); // Close the search results
    } else {
      setOpenSearchResults(true); // Open the search results
    }
  }, [searchValue]); // Run this effect when the search value changes

  // Use effect to add and remove the event listener for clicks outside the search container
  useEffect(() => {
    // Only add the listener if the dropdown is open
    if (openSearchResults) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener when component unmounts or dropdown closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSearchResults]); // Re-run effect when dropdown state changes

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
      {/* Left section Container */}
      <div className="flex items-center space-x-4">
        {/* Search Bar Container */}
        <div className="relative" ref={searchContainerRef}>
          {/* Text Field */}
          <input
            type="text"
            name="search"
            id="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search by name or ID"
            className="pl-9 pr-4 py-2 w-64 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />

          {/* Search Icon in SVG */}
          <span className="absolute left-3 top-2.5 text-gray-400">
            {/* Search icon would go here */}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </span>

          {/* Search Dropdown Menu Container */}
          {openSearchResults && (
            <div className="absolute left-0 mt-1 w-[500px] max-w-[600px] h-60 max-h-96 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-y-auto divide-y divide-gray-100">
              {/* Handle Loading */}
              {isSearching && (
                <>
                  <RenderSectionSkeleton />
                  <RenderSectionSkeleton />
                  <RenderSectionSkeleton />
                </>
              )}

              {/* Handle Error */}
              {!isSearching && !serverResponse.status && (
                <>
                  {/* Server Message */}
                  {serverResponse.message && !serverResponse.status && (
                    <div
                      className={`px-4 py-3 rounded relative m-4 ${
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
                      <span className="block sm:inline">
                        {serverResponse.message}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Handle Search Result */}
              {!isSearching && serverResponse.status && (
                <>
                  {/* Users Section Container */}
                  <RenderSection
                    title="Users"
                    count={searchResults.counts.users}
                    children={renderUsers(searchResults.users)}
                  />

                  {/* Orders Section */}
                  <RenderSection
                    title="Orders"
                    count={searchResults.counts.orders}
                    children={renderOrders(searchResults.orders)}
                  />

                  {/* Products Section */}
                  <RenderSection
                    title="Products"
                    count={searchResults.counts.products}
                    children={renderProducts(searchResults.products)}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right section Container */}
      <div className="flex items-center space-x-4">
        {/* Dropdown menu 1 */}
        <div className="relative">
          {/* Dropdown Button */}
          <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            <option>All Users</option>
            <option>Active Users</option>
            <option>Admins</option>
          </select>

          {/* Down Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {/* Dropdown menu 2 */}
        <div className="relative">
          <select className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 pl-4 pr-10 py-2 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
            <option>All Servers</option>
            <option>Production</option>
            <option>Development</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {/* Notification bell button */}
        <button className="relative p-2 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors">
          {/* Notification bell icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>

          {/* Notification indicator */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}

// Function to render the section with title and count and the rendered component
const RenderSection: React.FC<SectionProps> = ({ title, count, children }) => {
  return (
    <div className="p-3">
      <h3 className="text-sm font-medium text-gray-700 flex items-center justify-between mb-1">
        {title}
        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
          {count}
        </span>
      </h3>

      {children}
    </div>
  );
};

// Function to render the section with loading state
const RenderSectionSkeleton: React.FC = () => {
  return (
    <div className="p-3 animate-pulse">
      {/* Title and Counter Skeleton */}
      <div className="flex items-center justify-between mb-1">
        {/* Title Skeleton */}
        <div className="h-4 w-1/3 bg-gray-200 rounded" />

        {/* Counter Skeleton */}
        <span className="px-2 py-0.5 rounded-full">
          <div className="h-4 w-8 bg-gray-200 rounded-full" />
        </span>
      </div>

      {/* Skeleton for children */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

// Function to render users in the dropdown menu
const renderUsers = (usersArray: User[]) => {
  if (!usersArray.length) {
    return <p className="text-sm text-gray-500 italic py-1">No users found</p>;
  }

  return (
    <ul className="divide-y divide-gray-50">
      {usersArray.map((user) => (
        <li
          key={user.id}
          className="py-2 px-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
        >
          {/* Content Container */}
          <div className="flex items-center space-x-3">
            {/* User Avatar (Circle contain first name latter) */}
            <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
              {user.first_name.charAt(0).toUpperCase()}
            </div>

            {/* User Details Container */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user.first_name} {user.last_name}
              </p>

              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Function to render orders in the dropdown menu
const renderOrders = (ordersArray: Order[]) => {
  if (!ordersArray.length) {
    return <p className="text-sm text-gray-500 italic py-1">No Orders Found</p>;
  }

  return (
    <ul className="divide-y divide-gray-50">
      {ordersArray.map((order) => (
        <li
          key={order.id}
          className="py-2 px-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
        >
          {/* Content Container */}
          <div className="flex items-center space-x-3">
            {/* Order Details Container */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                Order ID: {order.id} | Order UUID:{order.uuid}
              </p>

              <p className="text-xs text-gray-500 truncate">
                Ordered By: {order.user?.first_name} on{" "}
                {formatDateTime(String(order.created_at))} with total of{" "}
                {convertPriceToBHD(String(order.total_price))}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

// Function to render products in the dropdown menu
const renderProducts = (productsArray: Product[]) => {
  if (!productsArray.length) {
    return (
      <p className="text-sm text-gray-500 italic py-1">No Products Found</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-50">
      {productsArray.map((product) => {
        // Get product price based on whether it's on sale or not
        const productPrice = product.onSale
          ? product.product_price_after_discount
          : product.product_price;

        // Get first image of the product
        const productImage = product.images[0] || icons.noImageIcon;

        return (
          <li
            key={product.id}
            className="py-2 px-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
          >
            {/* Content Container */}
            <div className="flex items-center space-x-3">
              {/* Product Image Container */}
              <div className="flex-shrink-0 h-8 w-8 bg-none rounded-full flex items-center justify-center">
                <Image
                  src={productImage}
                  alt={product.product_name}
                  width={43}
                  height={43}
                  className="rounded-full"
                />
              </div>

              {/* Order Details Container */}
              <div className="flex-1 min-w-0">
                {/* Product Name */}
                <p className="text-sm font-medium text-gray-800 truncate">
                  {product.product_name}
                </p>

                {/* Product Details (price + activity + stock) */}
                <p className="text-xs text-gray-500 truncate">
                  {convertPriceToBHD(String(productPrice))} |{" "}
                  {product.product_stock} in stock |{" "}
                  {product.is_active ? "Active" : "Inactive"}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

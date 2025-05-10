"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// import types
import { Product } from "@/types/product"; // Importing the Product type from types folder

// import the debounce hook to avoid too many API calls
import { useDebounce } from "@/lib/hooks";

// import helpers
import { convertPriceToBHD } from "@/lib/helpers";

// import backend services
import { searchProducts } from "@/services/products-services";

export default function ProductSearch() {
  // Router Instance
  const router = useRouter();

  /**
   * Search States
   */
  const [searchValue, setSearchValue] = useState<string>(""); // State to store the search value
  const [searchResults, setSearchResults] = useState<{
    productsCount: number;
    products: Product[]; // array of product objects
  }>({
    productsCount: 0,
    products: [],
  }); // State to store the search results

  /**
   * User Interface States
   */
  const [openSearchResults, setOpenSearchResults] = useState(false); // State to track if the search results are open
  const [isSearching, setIsSearching] = useState<boolean>(false); // State to track if a search is in progress
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // State to store the server response
  const searchContainerRef = useRef<HTMLDivElement>(null); // Create a ref for the search container to handle clicks outside of it

  const debouncedSearchTerm = useDebounce(searchValue, 300); // Set debounced search term to avoid too many API calls

  // Use effect to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!debouncedSearchTerm) return;

      // Set loading to true while fetching data
      setIsSearching(true);

      // Call the API to get the products based on the search term
      const response = await searchProducts(debouncedSearchTerm);

      // Set loading to false after fetching data
      setIsSearching(false);

      // Update the UI state with the response
      setServerResponse({
        status: response.status,
        message: !response.status && response.message, // show error message only if the response is not successful
      });

      if (response.status) {
        setSearchResults({
          productsCount: response.productsCount,
          products: response.products, // Update the search results with the response data
        }); // Update the search results with the response data
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

  // Function to Close the search results when clicking outside of it
  const handleClickOutside = (event: MouseEvent) => {
    // Check if we have a valid ref (click event) and if the click was outside our component
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(event.target as Node) // the target of the event is the ref of the search container (if its not inside the container close the dropdown)
    ) {
      setSearchValue(""); // Clear the search value
      setOpenSearchResults(false); // Close the search results
    }
  };

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
          const productImage = product.images[0];

          return (
            <li
              key={product.id}
              className="py-2 px-1 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
              onClick={() => {
                setSearchValue(""); // Clear the search value when a product is clicked
                setOpenSearchResults(false); // Close the search results
                router.push(`/products/${product.slug}`); // Navigate to the product page
              }}
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
                    {convertPriceToBHD(String(productPrice))}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    // Search Bar Container
    <div className="relative mr-5" ref={searchContainerRef}>
      {/* Text Field */}
      <input
        type="text"
        name="search"
        id="search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="What are you looking for?"
        className="pl-9 pr-4 py-2 w-80 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
      />

      {/* Search Icon in SVG */}
      <span className="absolute left-2 top-2 text-gray-400">
        {/* Search icon would go here */}
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      {/* Search Results Dropdown */}
      {openSearchResults && (
        <div className="absolute right-0 mt-1 w-[500px] max-w-[600px] h-60 max-h-96 bg-white rounded-md shadow-lg z-10 border border-gray-200 overflow-y-auto divide-y divide-gray-100">
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
              {/* Products Section */}
              <RenderSection
                title="Products"
                count={searchResults.productsCount}
                children={renderProducts(searchResults.products)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

// Function to render the section with title and count and the rendered component
const RenderSection: React.FC<{
  title: string;
  count: number;
  children: React.ReactNode;
}> = ({ title, count, children }) => {
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

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

// import backend services
import { getProducts, getProductsClient } from "@/services/products-services";

// import types
import { Product } from "@/types/product";
import { Category } from "@/types/category";

// import debounce helper
import { debounce } from "@/lib/helpers";

// import icons

// import custom components
import { ColumnLayout } from "@/components/(layouts)/ColumnLayout";
import ProductsGridLayout from "@/components/(layouts)/ProductsGridLayout";
import { getAllCategories } from "@/services/categories-services";
import PaginationControl from "@/components/PaginationControl";
import { convertPriceToBHD } from "@/lib/helpers";
import ProductCard from "@/components/ProductCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function page() {
  // Router Instance
  const router = useRouter();

  // URL Params Instance
  const searchParams = useSearchParams();

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the navigating status to prevent multiple requests "debounce"
  const [isNavigating, setIsNavigating] = useState(false);

  // State to store the data
  const [categories, setCategories] = useState<Category[]>();
  const [products, setProducts] = useState<Product[]>();

  // State to sort the products
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // array of selected categories slugs eg: ["cat1", "cat2", "cat3"]
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [onSale, setOnSale] = useState(false);
  const [sortBy, setSortBy] = useState<string>("");

  // State to store the pagination details
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(12);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  /**
   * Function to update the URL with the new params
   * @param updates - Object containing the updates to be applied to the URL params, {key: value}
   * @returns void
   *
   * @example
   * // Example usage:
   * updateURL({ page: "2", sortBy: "priceAsc" }); // Updates the URL to /products?page=2&sortBy=priceAsc
   * // Another example:
   * updateURL({ categories: "cat1,cat2", priceMin: "100", priceMax: "500" }); // Updates the URL to /products?categories=cat1,cat2&priceMin=100&priceMax=500
   */
  const updateURL = (updates: Record<string, string>) => {
    // If its already navigating, return to prevent multiple requests
    if (isNavigating) return;

    // Set is navigating to true to prevent multiple requests
    setIsNavigating(true);

    // Get the URL params and to set the new params based on the updates
    const params = new URLSearchParams(window.location.search);

    // Apply updates to the params to set the new URL
    Object.entries(updates).forEach(([key, value]) => {
      // Check if the value is not empty or null or undefined
      if (value) {
        params.set(key, value);
      } else {
        // If the value is empty, remove the param from the URL
        params.delete(key);
      }
    });

    // Reset to page 1 for filter changes (except page changes) [if changing to new filter and the page is not 1, reset to page 1 to avoid empty page]
    if (!("page" in updates)) {
      params.set("page", "1");
    }

    // Route to the new URL with the updated params
    router.push(`/products?${params.toString()}`);

    // Set is navigating to false after 500ms to allow the next request to be sent
    setTimeout(() => setIsNavigating(false), 500);
  };

  // Handle Categories Filter function
  const categoriesFilterHandler = (slugs: string[]) => {
    // Update the URL with the new categories param eg: slugs=["cat1", "cat2", "cat3"] => categories=cat1,cat2,cat3
    updateURL({ categories: slugs.join(",") });
  };

  // Handle Page Change function
  const handlePageChange = (newPage: number) => {
    // Update the URL with the new page param
    updateURL({ page: String(newPage) });
  };

  // Handle Sort By function
  const handleSortBy = (newSortBy: string) => {
    // Update the URL with the new sortBy param
    updateURL({ sortBy: String(newSortBy) });
  };

  // Handle Sort By On Sale function
  const handleOnSale = (newOnSale: boolean) => {
    // Update the URL with the new onSale param
    updateURL({ onSale: String(newOnSale) });
  };

  // Function to update the price range in the URL after debounce delay
  const debouncedPriceUpdate = useMemo(
    () =>
      debounce((range: [number, number]) => {
        updateURL({
          priceMin: String(range[0]),
          priceMax: String(range[1]),
        });
      }, 500), // 500ms delay then call the updateURL function
    []
  );

  // Handle Sort By Price Range
  const handlePriceRange = (newPriceRange: [number, number]) => {
    // Set the local state immediately for UI responsiveness
    setPriceRange(newPriceRange);

    // Update the URL with the new price range after debounce delay
    debouncedPriceUpdate(newPriceRange);
  };

  // Fetch data from server
  useEffect(() => {
    const fetchData = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Get the last URL params
      const params = new URLSearchParams(window.location.search);

      // Extract all params from the URL
      const initialPage = Number(params.get("page")) || 1; // Default page is 1
      const initialPerPage = Number(params.get("perPage")) || 12; // Default perPage is 12
      const initialCategories = params.get("categories")?.split(",") || []; // Default categories is empty array ex: category:cat1,cat2,cat3 => ["cat1", "cat2", "cat3"]
      const initialPriceMin = Number(params.get("priceMin")) || 0; // Default priceMin is 0
      const initialPriceMax = Number(params.get("priceMax")) || 5000; // Default priceMax is 5000
      const initialOnSale = params.get("onSale") === "true"; // Default onSale is false
      const initialSortBy = params.get("sortBy") || ""; // Default sortBy is empty string

      // Batch all state updates together
      setCurrentPage(initialPage);
      setPerPage(initialPerPage);
      setSelectedCategories(initialCategories);
      setPriceRange([initialPriceMin, initialPriceMax]);
      setOnSale(initialOnSale);
      setSortBy(initialSortBy);

      // Get Parallel Data
      const [categoriesFetching, productsFetching] = await Promise.all([
        getAllCategories(),
        getProductsClient(
          initialPage,
          initialPerPage,
          initialCategories, // categories slugs as array eg: ["cat1", "cat2", "cat3"]
          initialPriceMin, // min price
          initialPriceMax, // max price
          initialOnSale,
          initialSortBy
        ),
      ]);

      if (categoriesFetching.status) {
        // Set the categories data
        setCategories(categoriesFetching.categories);
      } else {
        // Set the server response
        setServerResponse({
          status: categoriesFetching.status,
          message: categoriesFetching.message,
        });
      }

      if (productsFetching.status) {
        // Set the products data
        setProducts(productsFetching.products);

        // Set the pagination details
        setTotalItems(productsFetching.totalProducts);
        setTotalPages(productsFetching.totalPages);
        setCurrentPage(productsFetching.currentPage);
        setPerPage(productsFetching.perPage);
      } else {
        // Set the server response
        setServerResponse({
          status: productsFetching.status,
          message: productsFetching.message,
        });
      }

      // Set loading to false after fetching data
      setLoading(false);
    };

    fetchData();
  }, [searchParams]); // Only depend on searchParams

  return (
    <>
      {/* Display message */}
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

      {/* Content Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Side: Filters Sidebar */}
        <nav className="w-[15%] h-[85vh] overflow-y-auto bg-orange-50 p-4 rounded-lg shadow ">
          {/* Label */}
          <h2 className="font-bold text-lg text-black mb-4">Filters</h2>

          {/* Categories Filter Container*/}
          <div className="mb-6">
            {/* Label */}
            <h3 className="font-medium mb-2">Categories:</h3>

            {/* Categories List Container*/}
            <div className="space-y-2">
              {categories?.map((category) => {
                return (
                  // Category Item Container
                  <div key={category.id} className="flex items-center">
                    {/* CheckBox Field */}
                    <input
                      type="checkbox"
                      id={`cat-${category.id}`}
                      checked={selectedCategories.includes(
                        category.category_slug
                      )} // Check if the category is selected
                      onChange={() => {
                        // Get the slug of the category
                        const slug = category.category_slug;

                        // Check if the category is already selected
                        const newSelected = selectedCategories.includes(slug)
                          ? selectedCategories.filter((s) => s !== slug) // Return the selected categories without the current category
                          : [...selectedCategories, slug]; // Add the category to the selected categories

                        categoriesFilterHandler(newSelected); // Update the selected categories in the URL
                      }}
                      className="mr-2"
                    />

                    {/* Checkbox Label */}
                    <label htmlFor={`cat-${category.id}`}>
                      {category.category_name}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price Range Filter Container */}
          <div className="mb-6">
            {/* Label */}
            <h3 className="font-medium mb-2">Price Range</h3>

            {/* Range Container */}
            <div className="flex items-center gap-2">
              {/* Min Price Input Container */}
              <div className="flex items-center">
                {/* Label */}
                <span className="mr-1">BD</span>

                {/* Min Range Field */}
                <input
                  type="number"
                  min="0"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const min = Math.max(0, Number(e.target.value));
                    const max = Math.max(min + 1, priceRange[1]);
                    handlePriceRange([min, max]);
                  }}
                  className="w-16 p-1 border rounded"
                />
              </div>

              <span>to</span>

              {/* Max Price Input Container */}
              <div className="flex items-center">
                {/* Label */}
                <span className="mr-1">BD</span>

                {/* Max Range Field */}
                <input
                  type="number"
                  min={priceRange[0] + 1}
                  value={priceRange[1]}
                  onChange={(e) => {
                    const max = Math.max(
                      priceRange[0] + 1,
                      Number(e.target.value)
                    );
                    handlePriceRange([priceRange[0], max]);
                  }}
                  className="w-16 p-1 border rounded"
                />
              </div>
            </div>
          </div>

          {/* On Sale Filter Container */}
          <div className="mb-6">
            {/* Field Container */}
            <div className="flex items-center">
              {/* On Sale Checkbox Field */}
              <input
                type="checkbox"
                id="on-sale"
                checked={onSale}
                onChange={() => {
                  handleOnSale(!onSale); // Toggle the onSale state
                }}
                className="mr-2"
              />

              {/* Checkbox Label */}
              <label htmlFor="on-sale">On Sale Only</label>
            </div>
          </div>

          {/* Sort Options Container */}
          <div className="mb-6">
            {/* Label */}
            <h3 className="font-medium mb-2">Sort By</h3>

            {/* Sort Options Fields */}
            <select
              value={sortBy}
              onChange={(e) => {
                // Request the new page with the new sortBy param
                handleSortBy(String(e.target.value));
              }}
              className="w-full p-2 border rounded"
            >
              <option value="">Default</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
              <option value="popular">Most Popular</option>
              <option value="bestSelling">Best Selling</option>
            </select>
          </div>
        </nav>

        {/* Right Side: Products grid */}
        <div className="w-[85%] flex flex-col justify-between min-h-[85vh]">
          {/* Products Grid */}
          <div className="grid gap-3 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-1">
            {/* Handle Loading */}
            <></>

            {/* Handle No Products */}
            <>
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                  <LoadingSpinner />
                </div>
              )}
            </>

            {/* Handle Date */}
            {products?.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>

          {/* Pagination Control Container */}
          <div className="flex items-center mt-4 gap-x-4 self-center">
            {/* Previous Button */}
            <button
              onClick={() => {
                // Get the param page to set the new page in the URL
                const newPage = currentPage - 1;

                // Request the new page
                handlePageChange(newPage);
              }}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${"bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"} ${
                currentPage === 1 ? "cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>

            {/* Counter of current page */}
            <span className="font-semibold">{`${currentPage} of ${totalPages}`}</span>

            {/* Next Button */}
            <button
              onClick={() => {
                // Get the param page to set the new page in the URL
                const newPage = currentPage + 1;

                // Request the new page
                handlePageChange(newPage);
              }}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${"bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"} ${
                currentPage === totalPages ? "cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

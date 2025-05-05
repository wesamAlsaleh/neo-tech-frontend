"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// import backend services
import { getProducts, getProductsClient } from "@/services/products-services";

// import types
import { Product } from "@/types/product";
import { Category } from "@/types/category";

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

  // Search Params Instance
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

  // Handle Page Change function
  const handlePageChange = (newPage: number) => {
    // If its already navigating, return to prevent multiple requests
    if (isNavigating) return;

    // Set is navigating to true to prevent multiple requests
    setIsNavigating(true);

    // Get the URL params and set the Page param
    const params = new URLSearchParams(searchParams);

    // Set the currentPage param in the URL eg: page=1
    params.set("page", String(newPage));

    // Route to the new URL with the updated params
    router.push(`/products?${params.toString()}`);

    // Set is navigating to false after 500ms to allow the next request to be sent
    setTimeout(() => setIsNavigating(false), 500);
  };

  // Handle Sort By function
  const handleSortBy = (newSortBy: string) => {
    // If its already navigating, return to prevent multiple requests
    if (isNavigating) return;

    // Set is navigating to true to prevent multiple requests
    setIsNavigating(true);

    // Get the URL params and set the sortBy param
    const params = new URLSearchParams(searchParams);

    // Set the sortBy param in the URL eg: sortBy=priceAsc
    params.set("sortBy", newSortBy);

    // Route to the new URL with the updated params
    router.push(`/products?${params.toString()}`);

    // Set is navigating to false after 500ms to allow the next request to be sent
    setTimeout(() => setIsNavigating(false), 500);
  };

  // Handle Sort By On Sale function
  const handleOnSale = (newOnSale: boolean) => {
    // If its already navigating, return to prevent multiple requests
    if (isNavigating) return;

    // Set is navigating to true to prevent multiple requests
    setIsNavigating(true);

    // Get the URL params and set the onSale param
    const params = new URLSearchParams(searchParams);

    // Set the onSale param in the URL eg: onSale=true
    params.set("onSale", String(newOnSale));

    // Route to the new URL with the updated params
    router.push(`/products?${params.toString()}`);

    // Set is navigating to false after 500ms to allow the next request to be sent
    setTimeout(() => setIsNavigating(false), 500);
  };

  // Fetch data from server
  const fetchData = async () => {
    // Get Parallel Data
    const [categoriesFetching, productsFetching] = await Promise.all([
      getAllCategories(),
      getProductsClient(
        currentPage,
        perPage,
        selectedCategories,
        priceRange[0], // min price
        priceRange[1], // max price
        onSale,
        sortBy
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
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the user cart data from the server
      await fetchData();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, [currentPage, perPage, selectedCategories, priceRange, onSale, sortBy]);

  // Initialize from URL params
  useEffect(() => {
    // Get the URL params and set the state variables accordingly
    const params = new URLSearchParams(searchParams);

    // If the URL has currentPage param, set the currentPage state variable eg:page=1
    if (params.has("page")) {
      setCurrentPage(Number(params.get("page")) || 1);
    }

    // If the URL has perPage param, set the perPage state variable eg:perPage=10
    if (params.has("perPage")) {
      setPerPage(Number(params.get("perPage")) || 10);
    }

    // If the URL has categories param, set the selectedCategories state variable which is an array of category slugs eg:categories=cat1,cat2,cat3 => ["cat1", "cat2", "cat3"]
    if (params.has("categories")) {
      setSelectedCategories(params.get("categories")?.split(",") || []); //%2 is comma encoded
    }

    // If the URL has priceRange param, set the priceRange state variable which is an array of two numbers eg:priceRange=10,100 => [10, 100]
    if (params.has("priceMin") && params.has("priceMax")) {
      setPriceRange([
        Number(params.get("priceMin")) || 0,
        Number(params.get("priceMax")) || 0,
      ]);
    }

    // If the URL has onSale param, set the onSale state variable eg:onSale=true => true
    if (params.has("onSale")) {
      setOnSale(params.get("onSale") === "true" ? true : false);
    }

    // If the URL has sortBy param, set the sortBy state variable eg:sortBy=priceAsc => "priceAsc"
    if (params.has("sortBy")) {
      setSortBy(
        params.get("sortBy") === "priceAsc"
          ? "priceAsc"
          : params.get("sortBy") === "priceDesc"
          ? "priceDesc"
          : params.get("sortBy") === "newest"
          ? "newest"
          : params.get("sortBy") === "popular"
          ? "popular"
          : params.get("sortBy") === "bestSelling"
          ? "bestSelling"
          : "newest"
      );
    }

    // Initialize other filters from URL...
  }, [searchParams]);

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
                          ? selectedCategories.filter((s) => s !== slug) // Remove the category from the selected categories
                          : [...selectedCategories, slug]; // Add the category to the selected categories

                        // Update the selected categories state
                        setSelectedCategories(newSelected); // Array of selected categories eg: ["cat1", "cat2", "cat3"]

                        // Get the URL params and set the categories param
                        const params = new URLSearchParams(searchParams);

                        // Set the categories param in the URL
                        params.set("categories", newSelected.join(",")); // Set the categories param in the URL eg: categories=cat1,cat2,cat3

                        // Route to the new URL with the updated params
                        router.push(`/products?${params.toString()}`);
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
            <div className="flex flex-col space-y-2">
              {/* Min Range Field */}
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={priceRange[0]}
                onChange={(e) => {
                  const newMin = Math.min(
                    Number(e.target.value),
                    priceRange[1] - 10
                  );
                  setPriceRange([newMin, priceRange[1]]);
                }}
              />

              {/* Max Range Field */}
              <input
                type="range"
                min={0}
                max={1000}
                step={10}
                value={priceRange[1]}
                onChange={(e) => {
                  const newMax = Math.max(
                    Number(e.target.value),
                    priceRange[0] + 10
                  );
                  setPriceRange([priceRange[0], newMax]);
                }}
              />

              {/* Price Range Display */}
              <div className="text-sm mt-2 text-center">
                {convertPriceToBHD(String(priceRange[0]))} -{" "}
                {convertPriceToBHD(String(priceRange[1]))}
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

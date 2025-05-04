"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

// import backend services
import { getProducts } from "@/services/products-services";

// import types
import { Product } from "@/types/product";

// import icons

// import custom components
import ProductsGridLayout from "@/components/(layouts)/ProductsGridLayout";
import { ColumnLayout } from "@/components/(layouts)/ColumnLayout";

export default function page() {
  // Router Instance
  const router = useRouter();

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the products data
  const [products, setProducts] = useState<Product[]>();

  // State to store the pagination details
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch data from server
  const fetchData = async () => {
    // Get Parallel Data
    const [response] = await Promise.all([getProducts(perPage, currentPage)]);

    // Set the server response
    setServerResponse({
      status: response.status,
      message: response.status ? "" : response.message, // if fetching is successful, set message to empty string
    });

    if (response.status) {
      // Set the data
      //   setTotalItems(response.totalOrders);

      // Set Navigation state
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
      setPerPage(response.perPage);
      setTotalPages(response.totalPages);
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
  }, [currentPage, perPage]);

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
      <div className="flex lg:flex-row md:flex-col sm:flex-col  gap-4">
        {/* Left Side: Filter */}
        <div className="w-[15%] bg-gray-200">here</div>

        {/* Right Side: Products grid */}
        <div className="w-[85%] bg-gray-400">here</div>
      </div>
    </>
  );
}

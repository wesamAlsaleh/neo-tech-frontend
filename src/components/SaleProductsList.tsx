"use client";

import React, { useEffect, useState } from "react";

// import types
import {
  Product,
  convertPriceToBHD,
  convertSalePercentage,
} from "@/types/product";
import { getSaleProducts } from "@/services/products-services";
import { icons } from "../../public/icons";
import LoadingSpinner from "./LoadingSpinner";

// import custom components

export default function SaleProductsList() {
  const [products, setProducts] = useState<Product[]>();

  // API status
  const [loading, setLoading] = useState<boolean>(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  // UI status
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch all product on sale from the database
  const fetchProductsOnSale = async () => {
    try {
      const response = await getSaleProducts(currentPage);

      // Update the UI with the fetched data
      setServerResponse({
        status: response.status,
        message: response.message!,
      });

      // If the server response is successful, set the products state
      if (response.status) {
        setProducts(response.products);
        setCurrentPage(response.currentPage);
        setTotalPages(response.totalPages);
        setTotalProducts(response.totalProducts);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch all products on sale
  useEffect(() => {
    fetchProductsOnSale();
  }, [currentPage]); // fetch features when currentPage changes or on initial render only

  // Display loading spinner

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-auto">
      {/* product list */}
      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr>
            <th className="px-4 py-2 border border-gray-300">Product Name</th>
            <th className="px-4 py-2 border border-gray-300">Product Image</th>
            <th className="px-4 py-2 border border-gray-300">Product Price</th>
            <th className="px-4 py-2 border border-gray-300">Sale Status</th>
            <th className="px-4 py-2 border border-gray-300">
              Sale Percentage
            </th>
            <th className="px-4 py-2 border border-gray-300">
              Sale Started on
            </th>
            <th className="px-4 py-2 border border-gray-300">Sale Ends on</th>
          </tr>
        </thead>

        {(products?.length || []) === 0 && (
          <tbody>
            <tr>
              <td colSpan={8} className="text-center py-4">
                No Badges found.
              </td>
            </tr>
          </tbody>
        )}

        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="hover:bg-gray-100 even:bg-gray-50">
              {/* Name Container */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {product.product_name}
              </td>

              {/* Icon Container */}
              <td className="px-4 py-2 border border-gray-300 flex justify-center items-center">
                <img
                  className="object-scale-down rounded w-12 h-12"
                  src={product.images[0]} // first image
                  alt={product.product_name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/100x100?text=No+Image";
                  }}
                />
              </td>

              {/* Product Price after the sale */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {convertPriceToBHD(product.product_price_after_discount)}
              </td>

              {/* Sale Status Container */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {/* bg color condition */}
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold ${
                    product.onSale
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {/* text color condition */}
                  {product.onSale ? "Yes" : "No"}
                </span>
              </td>

              {/* Discount percentage Container */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {convertSalePercentage(product.discount)}
              </td>

              {/* sale start date Container */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {product.sale_start}
              </td>

              {/* sale end date Container */}
              <td className="px-4 py-2 border border-gray-300 text-center">
                {product.sale_end}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Control */}
      {totalPages > 1 && (
        <div className="flex items-center mt-4 gap-x-4">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 border rounded ${
              currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Previous
          </button>

          <span className="font-semibold">{`${currentPage} of ${totalPages}`}</span>

          {/* Next Button */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 border rounded ${
              currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 text-white"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

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

// import custom components

export default function SaleProductsList() {
  const [products, setProducts] = useState<Product[]>();

  // API status
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="overflow-x-auto">
      {/* status  */}

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
            <th className="px-4 py-2 border border-gray-300">Actions</th>
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

              {/* Action buttons */}
              <td className="px-4 py-2 border border-gray-300">
                <div className="flex gap-2">
                  {/* Edit button */}
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                    onClick={() => {}}
                    title={`Edit `}
                  >
                    <img
                      src={icons.edit50.src}
                      alt="Edit"
                      width={24}
                      height={24}
                    />
                  </button>

                  {/* Delete button */}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                    onClick={() => {}}
                    title={`Delete product `}
                  >
                    <img
                      src={icons.delete50.src}
                      alt="Delete"
                      width={24}
                      height={24}
                    />
                  </button>

                  {/* Toggle status button */}
                  <button
                    className={`${
                      product.is_active
                        ? "bg-orange-400 hover:bg-orange-500"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                    onClick={() => {}}
                    title={
                      product.is_active
                        ? `Deactivate ${product.product_name}`
                        : `Activate product ${product.product_name}`
                    }
                  >
                    <img
                      src={
                        product.is_active
                          ? icons.removeBasket50.src
                          : icons.addBasket50.src
                      }
                      alt={product.is_active ? "Deactivate" : "Activate"}
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";

// import types
import { Product } from "@/types/product";
import { getSaleProducts } from "@/services/products-services";
import LoadingSpinner from "./LoadingSpinner";

// import helper functions
import {
  convertPriceToBHD,
  convertSalePercentage,
  formatDateTime,
} from "@/lib/helpers";

// import custom components
import TableStatusColumn from "./TableStatusColumn";
import Table from "./Table";
import Image from "next/image";

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
      // Set the loading state to true for the loading spinner while moving between pages in the pagination
      setLoading(true);

      // Fetch the data from the server
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

  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "product_name", label: " Product Name", align: "left" },
    { key: "images", label: "Product Image", align: "center" },
    {
      key: "product_price_after_discount",
      label: "Product Price",
      align: "center",
    },
    { key: "onSale", label: "Sale Status", align: "center" },
    { key: "discount", label: " Sale Percentage", align: "center" },
    { key: "sale_start", label: " Sale Started on", align: "center" },
    { key: "sale_end", label: " Sale Ends on", align: "center" },
  ]; // Define the columns for the table

  return (
    <Table
      columns={columns}
      rows={products || []}
      noDataMessage="No products on sale yet."
      renderCell={(row, key) => {
        // Render the product image
        if (key === "images") {
          return (
            <div className="flex justify-center items-center">
              <Image
                src={row.images[0]}
                alt={row.product_name}
                width={90}
                height={90}
              />
            </div>
          );
        }

        // Render the product price after sale
        if (key === "product_price_after_discount") {
          return (
            <span>{convertPriceToBHD(row.product_price_after_discount)}</span>
          );
        }

        // Render the sale badge
        if (key === "onSale") {
          // Check if the product is on sale
          const onSale = row.onSale;

          // Badge
          const baseClass = "px-3 py-1 rounded-md text-sm border capitalize"; // Define the base class for the role badge
          let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

          // Define the badge class based on the role
          if (onSale) {
            badgeClass = "bg-green-100 text-green-700 border-green-400";
          } else {
            badgeClass = "bg-red-100 text-red-700 border-red-400";
          }

          return (
            <span className={`${baseClass} ${badgeClass}`}>
              {onSale ? "On Sale" : "Not On Sale"}
            </span>
          );
        }

        // Render the sale percentage
        if (key === "discount") {
          return <span>{convertSalePercentage(row.discount)}</span>;
        }

        // Render the value of the cell without any special formatting
        return <span>{row[key]}</span>;
      }}
      isLoading={loading}
    />
  );
}

"use client";

import React, { useEffect, useState } from "react";

// import icons
import { icons } from "../../../../../public/icons";

// import axios
import axios from "axios";

// import date-fns for date manipulation
import { format } from "date-fns";

// import backend services
import { getProductStatistics } from "@/services/products-services";

// import components
import PageTitle from "@/components/PageTitle";
import { TwoColumnLayout } from "@/components/(layouts)/TwoColumnLayout";
import { ColumnLayout } from "@/components/(layouts)/ColumnLayout";
import Card from "@/components/Card";
import Table from "@/components/Table";
import Button from "@/components/Button";

/**
 * @function getAllProductsInCSV - to get all products in CSV format (for admin)
 */
export const getAllProductsInCSV = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/products/export/statistics/csv`,
      {
        responseType: "blob", // Set response type to blob for file download
      }
    );

    // Create a link element and trigger download
    const blob = new Blob([response.data], { type: "text/csv" });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element to reference the blob
    const link = document.createElement("a");

    // Set the href attribute to the blob URL
    link.href = url;

    // Get filename from headers
    const contentDisposition = response.headers["content-disposition"];

    // Get current date
    const currentDate = format(new Date(), "yyyy-MM-dd");

    // default fallback filename
    let filename = `neoTech_products_data_${currentDate}.csv`;

    // Set the download attribute with the filename
    link.setAttribute("download", filename); // this will be the name of the downloaded file e.g. neoTech_products_data_2023-10-01.csv

    // Append the link to the body (required for Firefox)
    document.body.appendChild(link);

    // Trigger the download
    link.click();

    // Clean up and remove the link
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return {
      status: true,
      message: "Your file downloaded successfully.",
    };
  } catch (error: any) {
    // Debugging error
    console.error(error);

    // Log the Developer message
    console.log(error.response.data.devMessage);

    return {
      status: false,
      message: error.response.data.message,
    };
  }
};

export default function page() {
  // State to store the product statistics data
  const [productStatistics, setProductStatistics] = useState<
    {
      product_name: string;
      product_rating: number;
      product_sold: number;
      product_view: number;
      is_active: boolean;
    }[]
  >();

  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  /**
   * Navigation States
   */
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(12);

  // Fetch user cart data from the server
  const fetchData = async () => {
    // Fetch the data parallel
    const response = await getProductStatistics(currentPage, perPage);

    console.log(response.products);

    // Update the UI state with the fetched data
    setServerResponse({
      status: response.status,
      message: response.message,
    });

    if (response.status) {
      setProductStatistics(response.products);

      // Update the pagination state
      setCurrentPage(response.currentPage);
      setPerPage(response.perPage);
      setTotalPages(response.totalPages);
      setTotalItems(response.totalProducts);
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the data from the server
      await fetchData();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, [currentPage, perPage]);

  // Prepare the data for the table
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "product_name", label: "Product Name", align: "center" },
    { key: "product_view", label: "Product View Count", align: "center" },
    { key: "product_sold", label: "Product Sold Count", align: "center" },
    { key: "product_rating", label: "Product Rating", align: "center" },
    { key: "is_active", label: "Is Active", align: "center" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <PageTitle
        title="Products Statistics"
        subtitle="View the statistics of the products in the system."
        actionButton={
          <Button
            text="Export to CSV"
            iconSrc={icons.excelIcon96.src}
            onClick={() => getAllProductsInCSV()}
          />
        }
      />

      {/* Table */}
      <Table
        columns={columns}
        rows={productStatistics || []}
        noDataMessage="No Products Available."
        isLoading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        renderCell={(row, key) => {
          // Render Rating
          if (key === "product_rating") {
            return <span>{row.product_rating} / 5</span>;
          }

          // Render Badge Status
          if (key === "is_active") {
            // Get the image status
            const isActive = row.is_active ? true : false;

            const statusText = isActive ? "Active" : "Inactive";

            // Badge
            const baseClass = "px-3 py-1 rounded-md text-sm border capitalize"; // Define the base class for the role badge
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

            // Define the badge class based on the status
            if (isActive) {
              badgeClass = "bg-green-100 text-green-700 border-green-400";
            } else {
              badgeClass = "bg-red-100 text-red-700 border-red-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>{statusText}</span>
            );
          }

          return <span>{row[key]}</span>;
        }}
      />
    </div>
  );
}

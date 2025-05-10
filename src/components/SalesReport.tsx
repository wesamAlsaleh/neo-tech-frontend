"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

// import axios for API calls
import axios from "axios";

// import helpers
import { convertPriceToBHD } from "@/lib/helpers";

// import backend services
import { getSalesReport } from "@/services/order-services";

// import icons
import { icons } from "../../public/icons";

// import date-fns for date manipulation
import { format, subMonths } from "date-fns";

// import components
import Table from "./Table";
import DataRangePicker from "./DataRangePicker";
import Card from "./Card";
import PageTitle from "./PageTitle";
import Button from "./Button";

/**
 * @function getSalesDataInCSV - to get all sales data in CSV format
 */
export const getSalesDataInCSV = async (
  start_date: string,
  end_date: string
) => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_APP_URI}/admin/sales/export/statistics/csv`,
      {
        params: {
          start_date,
          end_date,
        },
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

    // default fallback filename
    let filename = `neoTech_sales_data_${start_date}_to_${end_date}.csv`;

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

export default function SalesReport() {
  // Get the search params from the URL (start_date and end_date)
  const searchParams = useSearchParams();

  // State variables to store the start and end dates
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  // Set the start and end dates from the search params
  useEffect(() => {
    setStartDate(searchParams.get("start_date"));
    setEndDate(searchParams.get("end_date"));
  }, [searchParams]); // Only re-run when searchParams changes

  // State to store report data
  const [report, setReport] = useState<
    {
      product_id: number;
      product_name: string;
      product_unit_price: number;
      quantity_sold: number;
      total_revenue: number;
    }[]
  >();
  const [unitsSold, setUnitsSold] = useState<number>(0);

  // State to store loading state
  const [loading, setLoading] = useState(true);

  // State to store server response
  const [serverResponse, setServerResponse] = useState<{
    status: boolean;
    message: string;
  } | null>(null);

  /**
   * Navigation States
   */
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(10);

  // Function to fetch the report data from the server
  async function fetchReport() {
    if (!startDate || !endDate) {
      setServerResponse({
        status: false,
        message: "Start date and end date are required.",
      });
      return;
    }

    // Call the backend service to get the sales report
    const result = await getSalesReport(
      startDate,
      endDate,
      perPage,
      currentPage
    );

    // Update the UI
    setServerResponse({
      status: result.status,
      message: !result.status ? result.message : "", // Show error message if status is false
    });

    // If the request was successful, set the report data
    if (result.status) {
      // Set Data
      setReport(result.report);
      setUnitsSold(result.totalUnitsSold);

      // Set pagination data
      setTotalPages(result.totalPages);
      setTotalItems(result.totalReports);
      setPerPage(result.perPage);
      setCurrentPage(result.currentPage);
    }

    setLoading(false);
  }

  // Fetch the report when the component mounts or when startDate or endDate changes
  useEffect(() => {
    fetchReport();
  }, [startDate, endDate, currentPage, perPage]);

  // Prepare the columns for the table
  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    {
      key: "product_name",
      label: `Product Name (${totalItems})`,
      align: "center",
    },
    { key: "product_unit_price", label: "Unit Price", align: "center" },
    {
      key: "quantity_sold",
      label: `Units Sold (${unitsSold})`,
      align: "center",
    },
    { key: "total_revenue", label: "Revenue", align: "center" },
  ];

  return (
    <>
      <PageTitle
        title="Sales Reports"
        actionButton={
          <Button
            text="Export to CSV"
            iconSrc={icons.excelIcon96.src}
            onClick={() =>
              getSalesDataInCSV(String(startDate), String(endDate))
            }
          />
        }
      />

      {/* Main Section */}
      <div className="flex flex-col gap-y-4">
        {/* Server Message */}
        {!loading && serverResponse?.message && (
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

        <Card
          CardTitle="Sales Report"
          CardDescription="Select the date range to filter the sales report."
          CardContent={
            <DataRangePicker startDate={startDate} endDate={endDate} />
          }
          loading={loading}
        />

        {/* Table */}
        <Table
          columns={columns}
          rows={report || []}
          noDataMessage="No Data."
          isLoading={loading}
          renderCell={(row, key) => {
            // Format the cell based on the key
            if (key === "product_unit_price" || key === "total_revenue") {
              return <span>{convertPriceToBHD(String(row[key]))}</span>;
            }

            // Normal cell rendering for other keys
            return <span>{row[key]}</span>;
          }}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
}

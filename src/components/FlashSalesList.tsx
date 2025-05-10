"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Import the FlashSale type
import { FlashSale } from "@/types/sale";

// import helper functions
import { formatDateTime } from "@/lib/helpers";

// Import icons
import { icons } from "../../public/icons";

// Import services
import { deleteFlashSale, getFlashSales } from "@/services/sale-services";

// Import custom components
import ServerResponse from "./ServerResponse";
import LoadingSpinner from "./LoadingSpinner";
import TableStatusColumn from "./TableStatusColumn";
import DeleteModal from "./DeleteModal";
import Table from "./Table";

export default function FlashSalesList() {
  // Router instance
  const router = useRouter();

  const [flashSales, setFlashSales] = useState<FlashSale[]>(); // Flash sales state
  const [loading, setLoading] = useState(true); // Loading state

  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // Server response state

  // Delete Modal state
  const [selectedFlashSale, setSelectedFlashSale] = useState<FlashSale>();
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  // Fetch data function
  const fetchData = async () => {
    try {
      // Fetch products
      const response = await getFlashSales();

      // Update the UI with the fetched data
      setServerResponse({
        status: response.status,
        message: "", // I don't want to show the message if the status is true
      });

      if (response.status) {
        setFlashSales(response.flashSales);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch Data
  useEffect(() => {
    fetchData();
  }, []);

  // Handle delete product (to open modal with product data)
  const handleDeleteClick = (flashSale: FlashSale) => {
    setSelectedFlashSale(flashSale);
    setOpenDeleteModal(true);
  };

  // Handle confirm delete product
  const handleConfirmDelete = async () => {
    try {
      // If no product is selected, return
      if (!selectedFlashSale) return;

      // Delete the flash sale
      const response = await deleteFlashSale(String(selectedFlashSale.id));

      // Update the UI with the response
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      // Refresh products list by fetching data again
      if (response.status) {
        // Fetch data again
        fetchData();

        // Close the modal after successful delete
        setOpenDeleteModal(false);
      }
    } catch (error) {
      // Update the UI with the error message
      setServerResponse({
        status: false,
        message: "Failed to delete product. Please try again later.",
      });
    }
  };

  const columns: {
    key: string;
    label: string;
    align?: "left" | "center" | "right";
  }[] = [
    { key: "name", label: " Flash Sale Name", align: "left" },
    { key: "description", label: "Flash Sale Description", align: "center" },
    { key: "is_active", label: "Activity", align: "center" },
    { key: "start_date", label: "Flash Sale Start Date", align: "center" },
    { key: "end_date", label: "Flash Sale End Date", align: "center" },
    { key: "actions", label: "Actions", align: "center" },
  ]; // Define the columns for the table

  return (
    <>
      {/* Display Message  */}
      {serverResponse.message && (
        <ServerResponse
          message={serverResponse.message}
          condition={serverResponse.status}
        />
      )}

      {/* Flash Sales Table */}
      <Table
        columns={columns}
        rows={flashSales || []}
        isLoading={loading}
        noDataMessage="No flash sales in the system."
        onRowClick={(row) => console.log("Row clicked:", row)}
        renderCell={(row, key) => {
          // Format Activity cell
          if (key === "is_active") {
            const baseClass = "px-3 py-1 rounded-md text-sm border capitalize"; // Define the base class for the role badge
            let badgeClass = "bg-red-100 text-red-700 border border-red-400"; // Define the badge class based on the role

            const isActive = row[key] === 1 ? true : false; // Check if the value is "true" or "false"

            // Define the badge class based on the role
            if (isActive) {
              badgeClass = "bg-green-100 text-green-700 border-green-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>
                {isActive ? "Active" : "Not Active"}
              </span>
            );
          }

          // Format Date cells
          if (key === "start_date" || key === "end_date") {
            return <span>{formatDateTime(row[key])}</span>; // Format the date and return it
          }

          // Format Actions cell
          if (key === "actions") {
            return (
              <div className="flex items-center justify-center space-x-2">
                {/* Edit sale button */}
                <button
                  className={` bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                  title={`View ${row.name}`}
                  onClick={() =>
                    router.push(`/admin/customize/sales/${row.id}`)
                  }
                >
                  <img
                    src={icons.edit50.src}
                    alt={`View ${row.name}`}
                    width={24}
                    height={24}
                  />
                </button>

                {/* Delete button */}
                <button
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                  onClick={() => handleDeleteClick(row)}
                  title={`Delete ${row.name}`}
                >
                  <img
                    src={icons.delete50.src}
                    alt="Delete"
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            );
          }

          // Default cell rendering
          return <span>{row[key]}</span>;
        }}
      />

      {/* Delete Modal */}
      <DeleteModal
        isOpen={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        name={selectedFlashSale?.name!}
        onConfirm={() => handleConfirmDelete()}
        permanentAlert
      />
    </>
  );
}

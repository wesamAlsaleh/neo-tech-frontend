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

  // If loading display loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

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
      <table className="min-w-full table-auto border-collapse border border-gray-300 shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-300">
            <th className="px-4 py-2 border border-gray-300">
              Flash Sale Name
            </th>
            <th className="px-4 py-2 border border-gray-300">
              Flash Sale Description
            </th>
            <th className="px-4 py-2 border border-gray-300">Is Active</th>
            <th className="px-4 py-2 border border-gray-300">
              Flash Sale Start Date
            </th>
            <th className="px-4 py-2 border border-gray-300">
              Flash Sale End Date
            </th>
            <th className="px-4 py-2 border border-gray-300">Actions</th>
          </tr>
        </thead>

        <tbody className="text-center h-12">
          {(flashSales || []).length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center">
                No flash sales in the system.
              </td>
            </tr>
          ) : (
            flashSales?.map((flashSale) => (
              <tr
                key={flashSale.id}
                className="hover:bg-gray-100 even:bg-gray-50"
              >
                {/* Flash Sale Name */}
                <td className="px-4 py-2 border border-gray-300">
                  {flashSale.name}
                </td>

                {/* Flash Sale Description */}
                <td className="px-4 py-2 border border-gray-300">
                  {flashSale.description}
                </td>

                {/* Flash Sale Activity */}
                <td className="px-4 py-2 border border-gray-300">
                  <TableStatusColumn
                    condition={flashSale.is_active}
                    onYes="Active"
                    onNo="Inactive"
                  />
                </td>

                {/* Flash Sale Start Date */}
                <td className="px-4 py-2 border border-gray-300">
                  {formatDateTime(flashSale.start_date)}
                </td>

                {/* Flash Sale End Date */}
                <td className="px-4 py-2 border border-gray-300">
                  {formatDateTime(flashSale.end_date)}
                </td>

                {/* Actions */}
                <td className="px-4 py-2 border border-gray-300">
                  {/* Buttons container */}
                  <div className="flex items-center justify-center space-x-2">
                    {/* Edit sale button */}
                    <button
                      className={` bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition`}
                      title={`View ${flashSale.name}`}
                      onClick={() =>
                        router.push(`/admin/customize/sales/${flashSale.id}`)
                      }
                    >
                      <img
                        src={icons.edit50.src}
                        alt={`View ${flashSale.name}`}
                        width={24}
                        height={24}
                      />
                    </button>

                    {/* Delete button */}
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition"
                      onClick={() => handleDeleteClick(flashSale)}
                      title={`Delete ${flashSale.name}`}
                    >
                      <img
                        src={icons.delete50.src}
                        alt="Delete"
                        width={24}
                        height={24}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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

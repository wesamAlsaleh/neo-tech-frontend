"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

// import types
import { Order } from "@/types/order";

// import helpers
import { convertPriceToBHD } from "@/lib/helpers";

// import backend services
import { updateOrderStatus } from "@/services/order-services";

type OrdersManagerProps = {
  Orders?: Order[] | null; // Orders data
};

export default function getSystemLogsOrdersManager(props: OrdersManagerProps) {
  // Destructure props
  const { Orders } = props;

  // router instance
  const router = useRouter();

  // Dropdowns options
  const statusOptions = ["pending", "completed", "canceled"];

  /**
   * UI States
   */

  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // (Dynamic) State to track which order has open dropdown
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null); // (Dynamic) State to track the order ID that is currently being updated
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  }); // State to store the server response

  // Handle status change
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // Set updating status to the current order ID that is being updated to show loading state on the button
      setUpdatingStatus(orderId);

      // Call the backend service to update the order status
      const result = await updateOrderStatus(orderId, newStatus);

      // Update the UI state based on the server response
      setServerResponse({
        status: result.status,
        message: result.message,
      });

      // If the update was successful, refresh the page to get updated data
      if (result.status) {
        setTimeout(() => {
          setServerResponse({ status: false, message: "" }); // Clear the success message after 1 second
        }, 1000); // Delay for 1 second to show the success message

        router.refresh(); // Refresh the page to get the updated data
      }
    } finally {
      setUpdatingStatus(null); // Reset the updating status state after the operation is complete
      setOpenDropdownId(null); // Close the dropdown
    }
  };

  // Toggle dropdown visibility (dynamic dropdown, each menu has unique color based on order current status)
  const toggleDropdown = (orderId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event (in our case navigating to order details page)

    // set openDropdownId to the current order ID if it's not already open, otherwise set it to null
    setOpenDropdownId(openDropdownId === orderId ? null : orderId); // close the dropdown if the order id is already on the state
  };

  return (
    // Container for the orders manager
    <>
      {/* Display error message */}
      <div>
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
      </div>
      {/* Orders Manager Table Container */}
      <div className="rounded-lg shadow-md">
        {/* Table */}
        <table className="min-w-full">
          <thead>
            <tr className="bg-orange-500 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left rounded-tl-lg">Order ID</th>
              <th className="py-3 px-6 text-left">Customer Name</th>
              <th className="py-3 px-6 text-left">Shipping Address</th>
              <th className="py-3 px-6 text-right">Total Price</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center rounded-tr-lg">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-600 ">
            {/* Handle Without length */}
            {!Orders?.length && (
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td colSpan={6} className="py-3 px-6 text-center">
                  No Orders Found
                </td>
              </tr>
            )}

            {/* Handle with length */}
            {Orders?.map((order) => (
              <tr
                key={order.id}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  router.push(`/admin/orders/${order.id}`); // navigate to order details page without refreshing the page
                  window.scrollTo({ top: 0, behavior: "auto" }); // 'smooth' or 'auto'
                }}
              >
                <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                  {order.id}
                </td>

                <td className="py-3 px-6 text-left">
                  {order.user?.first_name}
                </td>

                <td className="py-3 px-6 text-left">
                  {order.shipping_address}
                </td>

                <td className="py-3 px-6 text-right font-medium">
                  {convertPriceToBHD(`${order.total_price}`)}
                </td>

                <td className="py-3 px-6 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      order.status === "completed"
                        ? "bg-green-100 text-green-700 border border-green-400"
                        : order.status === "pending"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-400"
                        : order.status === "canceled"
                        ? "bg-red-100 text-red-700 border border-red-400"
                        : "bg-gray-100 text-gray-700 border border-gray-400"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>

                {/* Actions */}
                <td
                  className="py-3 px-6 text-center relative"
                  onClick={(e) => e.stopPropagation()} // Prevent row click event on the td
                >
                  {/* Toggle Dropdown Button */}
                  <button
                    onClick={(event) => toggleDropdown(String(order.id), event)}
                    className={`bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium py-1 px-3 rounded ${
                      updatingStatus && "cursor-not-allowed"
                    }`}
                    disabled={updatingStatus === String(order.id)}
                  >
                    {updatingStatus === String(order.id)
                      ? "Updating..."
                      : "Change Status"}
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdownId === String(order.id) && (
                    // Dropdown Menu Container
                    <div className="absolute right-3 mt-2 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                      {/* Dropdown Options Container */}
                      <div className="py-1">
                        {statusOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              handleStatusChange(String(order.id), status)
                            }
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              status === order.status
                                ? order.status === "completed"
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : order.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : order.status === "canceled"
                                  ? "bg-red-100 text-red-700"
                                  : "text-gray-700 hover:bg-gray-100"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                            disabled={status === order.status}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

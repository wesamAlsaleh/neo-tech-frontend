import React, { useEffect, useState } from "react";

// import backend services
import { getAllOrders } from "@/services/order-services";

// import types
import { Order } from "@/types/order";

// import icons
import { icons } from "../../public/icons";

// import helpers
import { formatDateTime, convertPriceToBHD } from "@/lib/helpers";

// import custom components
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

export default function OrdersList() {
  // Router Instance
  const router = useRouter();

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the orders data
  const [orders, setOrders] = useState<Order[]>();

  // State to store the pagination details
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [perPage, setPerPage] = useState<number>(1);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch data from server
  const fetchData = async () => {
    // Call the server API to get the orders data
    const response = await getAllOrders(10, currentPage);

    console.log(response);

    // Set the server response
    setServerResponse({
      status: response.status,
      message: response.status ? "" : response.message, // if fetching is successful, set message to empty string
    });

    if (response.status) {
      setOrders(response.orders);
      setTotalItems(response.totalOrders);
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

  // if loading, display loading message
  if (loading) {
    return <LoadingSpinner />;
  }

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

      {/* Orders table */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200 h-12">
          <tr>
            <th className="px-4 py-2 border border-gray-300 w-11">Order ID</th>
            <th className="px-4 py-2 border border-gray-300 w-32">
              Customer Name
            </th>
            <th className="px-4 py-2 border border-gray-300 w-56">
              Shipping Address
            </th>
            <th className="px-4 py-2 border border-gray-300 w-28">Status</th>
            <th className="px-4 py-2 border border-gray-300 w-24">
              Total Price
            </th>
            <th className="px-4 py-2 border border-gray-300 w-24">
              Order Date
            </th>
          </tr>
        </thead>

        {orders?.length === 0 && (
          <tbody>
            <tr className="h-12">
              <td colSpan={5} className="text-center py-4">
                No orders found.
              </td>
            </tr>
          </tbody>
        )}

        <tbody>
          {orders?.map((order) => (
            <tr
              key={order.id}
              className="hover:bg-gray-100 even:bg-gray-50 h-16 cursor-pointer transition duration-200 ease-in-out"
              onClick={() => {
                router.push(`/admin/orders/${order.id}`); // navigate to order details page without refreshing the page
                window.scrollTo({ top: 0, behavior: "smooth" }); // 'smooth' or 'auto'
              }}
            >
              <td className="px-4 py-2 border border-gray-300 text-center">
                {order.id}
              </td>

              <td className="px-4 py-2 border border-gray-300 text-center">
                {order.user.first_name} {order.user.last_name}
              </td>

              <td className="px-4 py-2 border border-gray-300 text-center">
                <p className="text-xs text-gray-500 whitespace-normal break-words max-w-md">
                  {order.shipping_address}
                </p>
              </td>

              <td className="px-4 py-2 border border-gray-300 text-center">
                {/* Status Container */}
                <div
                  className={`text-xs px-2 py-1 rounded inline-block ${
                    order.status === "pending"
                      ? "bg-yellow-100 border border-yellow-400 text-yellow-700"
                      : order.status === "canceled"
                      ? "bg-red-100 border border-red-400 text-red-700"
                      : order.status === "completed"
                      ? "bg-green-100 border border-green-400 text-green-700"
                      : "bg-gray-100 border border-gray-400 text-gray-700"
                  }`}
                >
                  <h1 className="font-bold capitalize">{order.status}</h1>
                </div>
              </td>

              <td className="px-4 py-2 border border-gray-300 text-center">
                {convertPriceToBHD(String(order.total_price))}
              </td>

              <td className="px-4 py-2 border border-gray-300 text-center">
                {formatDateTime(order.created_at)}
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
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${"bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"}`}
          >
            Previous
          </button>

          {/* Counter of current page */}
          <span className="font-semibold">{`${currentPage} of ${totalPages}`}</span>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white rounded-md text-sm font-medium disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-offset-2 ${"bg-orange-600 hover:bg-orange-700 focus:ring-orange-500"}`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

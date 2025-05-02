import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
import Table from "./Table";

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
  const [perPage, setPerPage] = useState<number>(10);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch data from server
  const fetchData = async () => {
    // Call the server API to get the orders data
    const response = await getAllOrders(perPage, currentPage);

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

  // Prepare Table Columns
  const columns = [
    { key: "id", label: "Order ID" },
    { key: "customer_name", label: "Customer Name" },
    { key: "status", label: "Status" },
    { key: "total_price", label: "Total Price" },
    { key: "created_at", label: "Order Date" },
  ];

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
      <Table
        columns={columns}
        rows={orders || []}
        noDataMessage=" No orders found."
        isLoading={loading}
        onRowClick={(row) => {
          router.push(`/admin/orders/${row.id}`); // navigate to order details page without refreshing the page
          window.scrollTo({ top: 0, behavior: "smooth" }); // 'smooth' or 'auto'
        }}
        renderCell={(row, key) => {
          // Render User Name
          if (key === "customer_name") {
            return (
              <span>
                {row.user.first_name} {row.user.last_name}
              </span>
            );
          }

          // Render Order Status
          if (key === "status") {
            // Get the order status
            const status = row.status;

            // Badge
            const baseClass = "px-3 py-1 rounded-md text-sm border capitalize"; // Define the base class for the role badge
            let badgeClass = "bg-gray-100 text-gray-700 border border-gray-400"; // Define the badge class based on the role

            // Define the badge class based on the status
            if (status === "pending") {
              badgeClass = "bg-yellow-100 text-yellow-700 border-yellow-400";
            }
            if (status === "canceled") {
              badgeClass = "bg-red-100 text-red-700 border-red-400";
            }
            if (status === "completed") {
              badgeClass = "bg-green-100 text-green-700 border-green-400";
            }

            return (
              <span className={`${baseClass} ${badgeClass}`}>{status}</span>
            );
          }

          // Render Order Total Price
          if (key === "total_price") {
            return <span>{convertPriceToBHD(row.total_price)}</span>;
          }

          // Render Order Date
          if (key === "created_at") {
            return <span>{formatDateTime(row.created_at)}</span>;
          }

          // Render value of the cell without any formatting
          return <span>{row[key]}</span>;
        }}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        preventRowClick
        preventRowClickColumn="created_at"
      />
    </>
  );
}

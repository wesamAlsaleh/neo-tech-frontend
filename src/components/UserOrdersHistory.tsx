"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// import types
import { Order } from "@/types/order";

// import helpers
import { convertPriceToBHD, formatDateTime } from "@/lib/helpers";

// import backend services
import { getAllUserOrders } from "@/services/order-services";

// import components

export default function UserOrdersHistory() {
  // Router Instance
  const router = useRouter();

  // State to store user orders
  const [userOrders, setUserOrders] = useState<Order[]>();
  const [ordersCount, setOrdersCount] = useState<number>(0);

  // State to store the loading status
  const [loading, setLoading] = useState(false);

  // State to store the pagination details
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10); // Set default items per page to 10

  // Function to fetch order details and products available
  const fetchData = async () => {
    // Set loading to true while fetching data
    setLoading(true);

    // Fetch order details from the server
    const orderResponse = await getAllUserOrders(currentPage, perPage);

    console.log(orderResponse.orders);

    // Set loading to false after fetching data
    setLoading(false);

    if (orderResponse.status) {
      setUserOrders(orderResponse.orders);
      setOrdersCount(orderResponse.totalOrders);

      // Navigation states
      setPerPage(orderResponse.perPage);
      setCurrentPage(orderResponse.currentPage);
      setTotalPages(orderResponse.totalPages);
    }
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Fetch the user cart data from the server
      await fetchData();
    };

    initFetch();
  }, [currentPage, perPage]);

  return (
    // Component container
    <div className="my-6">
      {/* Content Container */}
      <div>
        {/* Section title */}
        <h1 className="text-2xl font-bold text-start text-gray-800">
          My Orders
        </h1>

        {/* Orders Table Container */}
        <div className="w-full overflow-auto mt-4">
          {/* Table */}
          <table className="w-full caption-bottom">
            <thead className="[&_tr]:border-b">
              <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">
                  Order ID
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Order Status
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Order Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Order Total
                </th>
              </tr>
            </thead>

            {/* Handle No Orders */}
            {userOrders?.length === 0 && (
              <tbody className="[&_tr:last-child]:border-0">
                <tr className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer">
                  <td className="p-4 align-middle text-left" colSpan={4}>
                    <h1 className="text-center text-gray-500 font-semibold">
                      No orders found
                    </h1>
                  </td>
                </tr>
              </tbody>
            )}

            {/* Handle Products */}
            <tbody className="[&_tr:last-child]:border-0">
              {userOrders?.map((order) => {
                return (
                  <tr
                    key={order.id}
                    className="transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted cursor-pointer"
                    onClick={() => {
                      router.push(`/my-orders/${order.uuid}`); // navigate to order details page without refreshing the page
                      window.scrollTo({ top: 0, behavior: "smooth" }); // 'smooth' or 'auto'
                    }}
                  >
                    <td className="p-4 align-middle text-left">{order.id}</td>

                    <td className="p-4 align-middle text-left">
                      {/* Status Container */}
                      <div
                        className={`text-sm px-2 py-1 rounded inline-block ${
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

                    <td className="p-4 align-middle text-left">
                      {formatDateTime(String(order.created_at))}
                    </td>

                    <td className="p-4 align-middle text-left">
                      {convertPriceToBHD(String(order.total_price))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

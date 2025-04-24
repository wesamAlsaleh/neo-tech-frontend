"use client";

import React from "react";
import { useRouter } from "next/navigation";

// import types
import { Order } from "@/types/order";

// import helpers
import { convertPriceToBHD } from "@/lib/helpers";

type OrdersManagerProps = {
  Orders?: Order[];
};

export default function OrdersManager(props: OrdersManagerProps) {
  // Destructure props
  const { Orders } = props;

  // router instance
  const router = useRouter();

  return (
    // Container for the orders manager
    <div className="overflow-x-auto rounded-lg shadow-md">
      {/* Table */}
      <table className="min-w-full">
        <thead>
          <tr className="bg-orange-500 text-white uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Order ID</th>
            <th className="py-3 px-6 text-left">Customer Name</th>
            <th className="py-3 px-6 text-left">Shipping Address</th>
            <th className="py-3 px-6 text-right">Total Price</th>
            <th className="py-3 px-6 text-center">Status</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 ">
          {/* TODO: Handle Loading */}

          {/* Handle Without length */}
          {Orders?.length === 0 && (
            <tr className="border-b border-gray-200 hover:bg-gray-50">
              <td colSpan={4} className="py-3 px-6 text-center">
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

              <td className="py-3 px-6 text-left">{order.user?.first_name}</td>

              <td className="py-3 px-6 text-left">{order.shipping_address}</td>

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
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

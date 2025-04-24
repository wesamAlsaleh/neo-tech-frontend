"use client";

import React from "react";

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

  return (
    // Container for the orders manager
    <div className="overflow-x-auto rounded-lg shadow-md">
      {/* Table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-orange-500 text-white uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Order ID</th>
            <th className="py-3 px-6 text-left">Customer Name</th>
            <th className="py-3 px-6 text-right">Total Price</th>
            <th className="py-3 px-6 text-center">Status</th>
          </tr>
        </thead>

        <tbody className="text-gray-600 text-sm">
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
              className="border-b border-gray-200 hover:bg-gray-50"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap font-medium">
                {order.id}
              </td>

              <td className="py-3 px-6 text-left">{order.user?.first_name}</td>

              <td className="py-3 px-6 text-right font-medium">
                {convertPriceToBHD(`${order.total_price}`)}
              </td>

              <td className="py-3 px-6 text-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    order.status === "completed"
                      ? "bg-green-200 text-green-800"
                      : order.status === "pending"
                      ? "bg-yellow-200 text-yellow-800"
                      : order.status === "processing"
                      ? "bg-blue-200 text-blue-800"
                      : order.status === "cancelled"
                      ? "bg-red-200 text-red-800"
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

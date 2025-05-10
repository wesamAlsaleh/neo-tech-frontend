"use client";

import React, { use, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// import types
import { OrderDetails } from "@/types/order";

// import helpers
import { convertPriceToBHD, formatDateTime } from "@/lib/helpers";

// import backend services
import { getOrderById } from "@/services/order-services";

// import components
import LoadingSpinner from "./LoadingSpinner";
import Button from "./Button";
import { tr } from "date-fns/locale";

export default function OrderPrint(props: { orderId: string }) {
  // Destructure the orderId from props
  const { orderId } = props;

  // Router Instance
  const router = useRouter();

  // State to store the order details
  const [order, setOrder] = useState<OrderDetails>();

  // State to store the loading status
  const [loading, setLoading] = useState(true);

  // State to store the server response
  const [serverResponse, setServerResponse] = useState<{
    status: boolean;
    message: string;
  }>();

  // Function to fetch order details by ID
  const fetchOrder = async () => {
    try {
      const response = await getOrderById(String(orderId));

      // Update UI state with the response
      setServerResponse({
        status: response.status,
        message: response.message,
      });

      if (!response.status) {
        setOrder(undefined);
        return;
      }

      setOrder(response.order);
    } finally {
      setLoading(false);
    }
  };

  //   Use effect to fetch order details when the component mounts
  useEffect(() => {
    // Check if orderId is available
    if (!orderId) return;

    fetchOrder();
  }, [orderId]);

  // Ref to store the print area
  const printRef = useRef<HTMLDivElement>(null);

  // Function to handle print
  const handlePrint = () => {
    // Create a new window (pop-up window) with just the order content
    const printWindow = window.open("sds", "_blank", "width=1000,height=800");

    if (!printWindow) {
      alert("Please allow pop-ups to print the order");
      return;
    }

    // Get the HTML content of the print area
    const contentToPrint = printRef.current?.innerHTML;

    if (!contentToPrint) {
      alert("No content to print");
      return;
    }

    // Open Print Window CTRL + P
    printWindow.document.open();

    // Write the HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Order #${order?.id || ""}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: black;
            }
            .order-container {
              max-width: 800px;
              margin: 0 auto;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              padding: 8px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              font-weight: bold;
            }
            
            .text-right {
              text-align: right;
            }
            .mt-8 {
              margin-top: 32px;
            }
            .mb-2 {
              margin-bottom: 8px;
            }
            .mb-6 {
              margin-bottom: 24px;
            }
            .font-bold {
              font-weight: bold;
            }
            .text-2xl {
              font-size: 1.5rem;
            }
            .text-lg {
              font-size: 1.125rem;
            }
            .text-sm {
              font-size: 0.875rem;
            }
            .text-gray-500 {
              color: #6b7280;
            }
          </style>
        </head>
        <body>
          <div class="order-container">
            ${contentToPrint}
          </div>
          <script>
            // Automatically trigger print when loaded
            window.onload = function() {
              window.print();
              // Close the window after print dialog is closed (optional)
              window.onfocus = function() { 
                setTimeout(function() { window.close(); }, 500);
              }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // If loading, show a loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If there is no order, show an error message
  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <div className="print:p-0 container mx-auto">
      {/* Error Messages (not printed) */}
      {serverResponse?.message && !serverResponse?.status && (
        <div
          className={`no-print px-4 py-3 rounded relative mb-4 ${
            serverResponse.status
              ? "bg-green-100 border border-green-400 text-green-700"
              : "bg-red-100 border border-red-400 text-red-700 "
          }`}
          role="alert"
        >
          {serverResponse?.status ? (
            <strong className="font-bold">Success! </strong>
          ) : (
            <strong className="font-bold">Error! </strong>
          )}
          <span className="block sm:inline">{serverResponse.message}</span>
        </div>
      )}

      {/* Print Controls (not printed) */}
      <div className="flex justify-between mb-4 no-print">
        <Button text="Back" onClick={() => router.back()} />
        <Button text="Print Order" onClick={handlePrint} />
      </div>

      {/* Printable Content */}
      <div
        className="bg-white p-6 rounded-lg shadow print:shadow-none print-area"
        ref={printRef}
      >
        {/* Order Header Container */}
        <div className="text-start mb-6">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-sm text-gray-500">{order.uuid}</p>
        </div>

        {/* Customer and Order Info Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Customer Details Container */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">
              Customer Information:
            </h2>
            <p>
              Name: {order.user.first_name} {order.user.last_name}
            </p>
            <p> Email Address: {order.user.email}</p>
            <p> Phone Number: {order.user.phone_number}</p>
            <p>Shipping Address: {order.shipping_address}</p>
          </div>

          {/* Order Details Container */}
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Order Details:</h2>
            <p>Date: {formatDateTime(String(order.created_at))}</p>
            <p>
              Order Status: <span className="capitalize">{order.status}</span>
            </p>
          </div>

          {/* Order Items Container */}
          <div className="flex flex-col col-span-2">
            <h2 className="text-lg font-semibold mb-2">Order Items</h2>

            {/* Order Items Table */}
            <table className="w-full mb-6">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pl-2">Product</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2 pr-2">Total</th>
                </tr>
              </thead>

              <tbody>
                {order.order_items.map((orderItem) => {
                  return (
                    <tr key={orderItem.id} className="border-b">
                      <td className="py-2 pl-2">
                        {orderItem.product?.product_name}
                      </td>
                      <td className="text-right py-2">
                        {orderItem.product.product_price}
                      </td>
                      <td className="text-right py-2">{orderItem.quantity}</td>
                      <td className="text-right py-2 pr-2">
                        {convertPriceToBHD(String(orderItem.price))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Order Total Price */}
          <div className="flex">
            <p> Total Amount: {convertPriceToBHD(String(order.total_price))}</p>
          </div>

          {/* Thank you message or company info */}
          <div className="text-start text-sm mt-8">
            <p>Thank you for your order!</p>
            <p>NeoTech • contact@yourcompany.com • www.neoTech.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

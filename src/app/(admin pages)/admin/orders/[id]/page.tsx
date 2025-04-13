"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// Import the OrderDetails type
import { OrderDetails } from "@/types/order";

// import backend services
import { getOrderById } from "@/services/order-services";

// import helpers
import { formatDateTime, convertPriceToBHD } from "@/lib/helpers";

// import icons
import { icons } from "../../../../../../public/icons";

// import custom components
import LoadingSpinner from "@/components/LoadingSpinner";
import Card from "@/components/Card";
import Button from "@/components/Button";
import PageTitle from "@/components/PageTitle";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  // Router instance
  const router = useRouter();

  // Get the order ID from the URL parameters then extract the order ID from the promise
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // State to store the loading status
  const [loading, setLoading] = useState<boolean>(true);

  // State to store the order details
  const [order, setOrder] = useState<OrderDetails>();

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  /**
   * @function getStatusColor - Get the status color based on the order status
   * @param status - The order
   * @returns {string} - The status color class
   */
  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 border border-yellow-400 text-yellow-700";
      // case "processing":
      // return "bg-blue-100 border border-blue-400 text-blue-700";
      case "completed":
        return "bg-green-100 border border-green-400 text-green-700";
      // case "delivered":
      // return "bg-green-100 border border-green-400 text-green-700";
      case "cancelled":
        return "bg-red-100 border border-red-400 text-red-700";
      default:
        return "bg-gray-100 border border-gray-400 text-gray-700";
    }
  };

  // Fetch data from server
  const fetchData = async () => {
    // Call the server API to get the order details
    const response = await getOrderById(id);

    // Update the UI
    setServerResponse({
      status: response.status,
      message: response.message,
    });

    if (response.status) {
      setOrder(response.order);
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
  }, []);

  // If the loading state is true, show a loading message
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Header Container */}
      <PageTitle
        title={`Order #${id}`}
        subtitle={`Manage order #${id} details`}
        highlightText={`placed by ${order?.user.first_name} ${
          order?.user.last_name
        } on ${formatDateTime(String(order?.created_at))}`}
        actionButton={
          <Button iconSize={21} text="Back" onClick={() => router.back()} />
        }
        actionButton2={<Button text="Download" />}
        actionButton3={<Button text="Print" />}
      />

      {/* Content Container */}
      <div>
        {/* Top half Container */}
        <div>
          {/* Order Items List Container*/}
          <div></div>

          {/* Order Summary Container*/}
          <div></div>
        </div>

        {/* Bottom half Container */}
        <div>
          {/* Shipping Information Container */}
          <div></div>
          {/* Payment Information Container */}
          <div>
            {/* Info Container */}

            {/* Request Invoice Button Container */}
          </div>
        </div>
      </div>
    </>
  );
}

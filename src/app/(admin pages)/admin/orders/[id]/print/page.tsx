"use client";

import React, { use } from "react";

// import custom components
import OrderPrint from "@/components/OrderPrint";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  // Get the order ID from the URL parameters then extract the order ID from the promise
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  // Pass the order ID as a prop to the OrderPrint component
  return <OrderPrint orderId={id} />;
}

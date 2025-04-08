"use client";

import React, { useEffect, useState } from "react";

// import backend services
import { getAllOrders } from "@/services/order-services";

// import types
import { Order } from "@/types/order";

// import custom components
import PageTitle from "@/components/PageTitle";
import OrdersList from "@/components/OrdersList";

export default function page() {
  return (
    <>
      {/* Title */}
      <PageTitle title="Orders" subtitle="Manage orders from here" />

      {/* Table */}
      <OrdersList />
    </>
  );
}

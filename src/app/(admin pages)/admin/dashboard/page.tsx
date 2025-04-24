"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

// import backend services
import { getLastOrders } from "@/services/order-services";

// import types
import { Order } from "@/types/order";

// import custom components
import Card from "@/components/Card";
import UsersChart from "@/components/(charts)/UsersChart";
import SalesChart from "@/components/(charts)/SalesChart";
import OrdersManager from "@/components/OrdersManager";

/**
 * @constant Height for Small cards is 160px (widgets)
 * @constant Height for Medium cards is 400px (graphs)
 * @constant Height for Large cards is 600px (orders manager, system status)
 */

// sample data
const growthData = [
  { growth: 12, week: "01-02-2025" },
  { growth: 18, week: "08-02-2025" },
  { growth: 22, week: "15-02-2025" },
  { growth: 30, week: "22-02-2025" },

  { growth: 35, week: "01-03-2025" },
  { growth: 40, week: "08-03-2025" },
  { growth: 45, week: "15-03-2025" },
  { growth: 52, week: "22-03-2025" },

  { growth: 60, week: "29-03-2025" },
  { growth: 68, week: "05-04-2025" },
  { growth: 75, week: "12-04-2025" },
  { growth: 180, week: "19-04-2025" },
];

export default function dashboardPage() {
  // State to manage loading states
  const [loading, setLoading] = useState(false);

  // States
  const [orders, setOrders] = useState<Order[]>();

  // Fetch user cart data from the server
  const fetchData = async () => {
    // Fetch the data parallel
    const [ordersResponse] = await Promise.all([getLastOrders()]);

    setOrders(ordersResponse.orders);
  };

  // Fetch data from server
  useEffect(() => {
    const initFetch = async () => {
      // Set loading to true while fetching data
      setLoading(true);

      // Fetch the data from the server
      await fetchData();

      // Set loading to false after fetching data
      setLoading(false);
    };

    initFetch();
  }, []);
  return (
    // Dashboard Page Layout
    <div className="flex flex-col gap-4">
      {/* Widgets Section 1 Container */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card
          CardTitle="Today's Sales Summary"
          CardDescription={"4 Orders"}
          CardContent={"BD 100"}
        />

        <Card
          CardTitle="Pending Orders"
          CardDescription={"2 Orders"}
          CardContent={"BD 50"}
        />

        <Card
          CardTitle="Products Inventory"
          CardDescription={"14 Inactive Products"}
          CardContent={"2 Products"}
        />

        <Card
          CardTitle="Customer Overview"
          CardDescription={"Total Customers"}
          CardContent={"100 Users"}
        />

        <Card
          CardTitle="Total Revenue"
          CardDescription={"Total Revenue"}
          CardContent={"BD 5000"}
        />
      </div>

      {/* Widgets Section 2 Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Container */}
        <div className="flex flex-col gap-4">
          {/* Total Users Graph Widget Section */}
          <>
            <Card
              CardTitle="User Signups"
              CardDescription="Growth over the last 3 months"
              CardHight={"h-[400px]"}
              CardContent={<UsersChart data={growthData} />}
            />
          </>
        </div>

        {/* Right Container */}
        <div className="flex flex-col gap-4">
          {/* Sales Graph Widget Section */}
          <>
            <Card
              CardTitle="Monthly Sales"
              CardDescription="↑ 34% from last month"
              CardHight={"h-[400px]"}
              CardContent={<SalesChart />}
            />
          </>
        </div>
      </div>

      {/* Manager Widgets Container */}
      <div className="grid grid-cols-1 gap-4">
        {/* Orders Manager Card */}
        <Card
          CardTitle="Orders Manager"
          CardDescription="Manage Latest Orders"
          CardHight={"h-[610px] md:h-[710px]"}
          CardContent={<OrdersManager Orders={orders} />}
        />

        {/* System Status Card (Uptime, performance logs) */}
        <Card
          CardTitle="System Status"
          CardDescription="Uptime, performance logs"
          CardHight={"h-[200px] md:h-[300px]"}
        />
      </div>
    </div>
  );
}

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
import LoadingSpinner from "@/components/LoadingSpinner";
import SystemPerformanceLogs from "@/components/SystemPerformanceLogs";

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

  // State to manage orders data
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

  // UseEffect to automatically refresh the page every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData(); // Fetch data every 15 seconds
    }, 15000); // 15 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  // Loading state
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    // Dashboard Page Layout
    <div className="flex flex-col gap-4">
      {/* Small Widgets Container */}
      <FiveColumnLayout>
        <SmallWidgetCard
          title="Today's Sales Summary"
          description="4 Orders"
          content="BD 100"
        />

        <SmallWidgetCard
          title={"Pending Orders"}
          description={"2 Orders"}
          content={"BD 50"}
        />

        <SmallWidgetCard
          title={"Products Inventory"}
          description={"14 Inactive Products"}
          content={"2 Products"}
        />

        <SmallWidgetCard
          title={"Customer Overview"}
          description={"Total Customers"}
          content={"100 Users"}
        />

        <SmallWidgetCard
          title={"Total Revenue"}
          description={"Total Revenue"}
          content={"BD 5000"}
        />
      </FiveColumnLayout>

      {/* Chart Widgets Container */}
      <TwoColumnLayout>
        {/* Left Container */}
        <ColumnLayout>
          {/* Total Users Graph Widget Section */}
          <MediumWidgetCard
            title={"User Signups"}
            description={"Growth over the last 3 months"}
            content={<UsersChart data={growthData} />}
          />
        </ColumnLayout>

        {/* Right Container */}
        <ColumnLayout>
          {/* Sales Graph Widget Section */}

          <MediumWidgetCard
            title={"Monthly Sales"}
            description={"↑ 34% from last month"}
            content={<SalesChart />}
          />
        </ColumnLayout>
      </TwoColumnLayout>

      {/* Orders Manager Widget Container */}
      <ColumnLayout>
        {/* Orders Manager Card */}
        <Card
          CardTitle="Orders Manager"
          CardDescription="Manage Latest Orders"
          CardHight={"h-[610px] md:h-[710px]"}
          CardContent={<OrdersManager Orders={orders} />}
        />
      </ColumnLayout>

      <TwoColumnLayout>
        {/* Left Container */}
        <ColumnLayout>
          {/* System Status Card (Uptime, performance logs) */}
          <MediumWidgetCard
            title={"System Status"}
            description={"Uptime, performance logs"}
            content={<SystemPerformanceLogs />}
          />
        </ColumnLayout>

        {/* Right Container */}
        <ColumnLayout>
          {/* Best Selling Products Chart */}
          <MediumWidgetCard
            title={"Best Selling Products"}
            description={"Top 5 Products"}
            content={null}
          />
        </ColumnLayout>
      </TwoColumnLayout>
    </div>
  );
}

// Widget Card Layout for 5 columns
const FiveColumnLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">{children}</div>
);

// Widget Card Layout for 2 columns
const TwoColumnLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">{children}</div>
);

const ColumnLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 gap-4">{children}</div>
);

// Widget Card Component
const SmallWidgetCard = ({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: React.ReactNode;
}) => (
  <Card
    CardTitle={title}
    CardDescription={description}
    CardContent={content}
    CardHight={"h-[160px]"}
  />
);

// Widget Card for Graphs
const MediumWidgetCard = ({
  title,
  description,
  content,
}: {
  title: string;
  description: string;
  content: React.ReactNode;
}) => (
  <Card
    CardTitle={title}
    CardDescription={description}
    CardContent={content}
    CardHight={"h-[400px]"}
  />
);

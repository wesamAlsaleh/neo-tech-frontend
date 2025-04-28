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
import MostSelledProductsChart from "@/components/(charts)/MostSelledProductsChart";

/**
 * @constant Height for Small cards is 160px (widgets)
 * @constant Height for Medium cards is 400px (graphs)
 * @constant Height for Large cards is 600px (orders manager, system status)
 */

export default function dashboardPage() {
  // State to manage loading states
  const [loading, setLoading] = useState(false);

  /**
   * State's to manage the data
   */
  const [orders, setOrders] = useState<Order[]>();

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch user cart data from the server
  const fetchData = async () => {
    // Fetch the data parallel
    const [ordersResponse] = await Promise.all([getLastOrders()]);

    if (!ordersResponse.status) {
      setServerResponse({
        status: ordersResponse.status,
        message: ordersResponse.message,
      });
      return;
    }

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
            content={
              <UsersChart
                data={[
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
                ]}
              />
            }
          />
        </ColumnLayout>

        {/* Right Container */}
        <ColumnLayout>
          {/* Sales Graph Widget Section */}

          <MediumWidgetCard
            title={"Monthly Sales"}
            description={"↑ 34% from last month"}
            content={
              <SalesChart
                data={[
                  { date: "24-1-2025", revenue: 1200 },
                  { date: "1-2-2025", revenue: 1500 },
                  { date: "12-2-2025", revenue: 1700 },
                  { date: "24-3-2025", revenue: 1600 },
                  { date: "1-3-2025", revenue: 1800 },
                  { date: "12-3-2025", revenue: 2000 },
                  { date: "20-3-2025", revenue: 2200 },
                  { date: "Today", revenue: 2500 },
                ]}
              />
            }
          />
        </ColumnLayout>
      </TwoColumnLayout>

      {/* Orders Manager Widget Container */}
      <ColumnLayout>
        {/* Orders Manager Card */}
        <Card
          CardTitle="Orders Manager"
          CardDescription="Manage Latest Orders"
          CardHeight={"h-[610px] md:h-[710px]"}
          CardMaxContentHeight={"max-h-[600px]"} // Set max height for content area
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
            content={
              <MostSelledProductsChart
                data={[
                  {
                    soldCount: 341,
                    viewCount: 1200,
                    name: "Product Asadasdasdasd",
                  },
                  {
                    soldCount: 141,
                    viewCount: 1500,
                    name: "Product BafasfAsadasdasdasd",
                  },
                  {
                    soldCount: 251,
                    viewCount: 1500,
                    name: "Product CBafasfAsadasdasdasd",
                  },
                  {
                    soldCount: 361,
                    viewCount: 1700,
                    name: "Product DCBafasfAsadasdasdasd",
                  },
                  {
                    soldCount: 141,
                    viewCount: 1700,
                    name: "Product EDCBafasfAsadasdasdasd",
                  },
                  { soldCount: 471, viewCount: 1600, name: "Product F" },
                  { soldCount: 451, viewCount: 1800, name: "Product G" },
                  { soldCount: 114, viewCount: 2000, name: "Product H" },
                  { soldCount: 145, viewCount: 2200, name: "Product I" },
                ]}
              />
            }
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
  description?: string;
  content: React.ReactNode;
}) => (
  <Card
    CardTitle={title}
    CardDescription={description}
    CardContent={content}
    CardHeight={"h-[160px]"}
  />
);

// Widget Card for Graphs
const MediumWidgetCard = ({
  title,
  description,
  content,
}: {
  title: string;
  description?: string;
  content: React.ReactNode;
}) => (
  <Card
    CardTitle={title}
    CardDescription={description}
    CardContent={content}
    CardHeight={"h-[400px]"}
    CardMaxContentHeight={"max-h-[300px]"} // Set max height for content area
  />
);

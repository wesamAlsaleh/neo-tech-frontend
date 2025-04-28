"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

// import backend services
import {
  getLastOrders,
  getMonthlyRevenueStatistics,
  getMostViewedProducts,
  getProductsInventoryStatus,
  getTodaysOrders,
  getTotalPendingOrders,
  getTotalRevenueOfMonth,
  getTotalUsers,
  getUserSignupStatistics,
} from "@/services/dashboard-services";

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
import { convertPriceToBHD } from "@/lib/helpers";

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
  const [todaysSalesSummary, setTodaysSalesSummary] = useState({
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [pendingOrders, setPendingOrders] = useState({
    totalPendingOrders: 0,
    totalPendingOrdersRevenue: 0,
  });
  const [productsInventory, setProductsInventory] = useState({
    totalProducts: 0,
    totalActiveProducts: 0,
    totalInactiveProducts: 0,
  });
  const [customerOverview, setCustomerOverview] = useState({
    totalCustomers: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState({
    dateDetails: "",
    totalRevenue: 0,
  });
  const [orders, setOrders] = useState<Order[]>();
  // Charts data
  const [signupStatisticsChartData, setSignupStatisticsChartData] = useState();
  const [
    monthlyRevenueStatisticsChartData,
    setMonthlyRevenueStatisticsChartData,
  ] = useState();
  const [mostViewedProductsChartData, setMostViewedProductsChartData] =
    useState();

  // State to store the server response
  const [serverResponse, setServerResponse] = useState({
    status: false,
    message: "",
  });

  // Fetch user cart data from the server
  const fetchData = async () => {
    // Fetch the data parallel
    const [
      todaysSalesSummaryResponse,
      pendingOrdersResponse,
      productsInventoryResponse,
      customerOverviewResponse,
      totalRevenueResponse,
      userSignupStatisticsResponse,
      monthlyRevenueStatisticsResponse,
      ordersResponse,
      mostViewedProductsResponse,
    ] = await Promise.all([
      getTodaysOrders(),
      getTotalPendingOrders(),
      getProductsInventoryStatus(),
      getTotalUsers(),
      getTotalRevenueOfMonth(),
      getUserSignupStatistics(),
      getMonthlyRevenueStatistics(),
      getLastOrders(),
      getMostViewedProducts(),
    ]);

    // Check if the response is successful
    if (
      todaysSalesSummaryResponse.status &&
      pendingOrdersResponse.status &&
      productsInventoryResponse.status &&
      customerOverviewResponse.status &&
      totalRevenueResponse.status &&
      userSignupStatisticsResponse.status &&
      monthlyRevenueStatisticsResponse.status &&
      ordersResponse.status &&
      mostViewedProductsResponse.status
    ) {
      // Set the data to the state
      setTodaysSalesSummary({
        totalOrders: todaysSalesSummaryResponse.totalOrders,
        totalRevenue: todaysSalesSummaryResponse.totalRevenue,
      });
      setPendingOrders({
        totalPendingOrders: pendingOrdersResponse.totalPendingOrders,
        totalPendingOrdersRevenue: pendingOrdersResponse.totalPendingRevenue,
      });
      setProductsInventory({
        totalProducts: productsInventoryResponse.totalProducts,
        totalActiveProducts: productsInventoryResponse.totalActiveProducts,
        totalInactiveProducts: productsInventoryResponse.totalInactiveProducts,
      });
      setCustomerOverview({
        totalCustomers: customerOverviewResponse.totalUsers,
      });
      setTotalRevenue({
        dateDetails: totalRevenueResponse.dateDetails,
        totalRevenue: totalRevenueResponse.totalRevenue,
      });
      setOrders(ordersResponse.orders);
      setSignupStatisticsChartData(userSignupStatisticsResponse.growthData);
      setMonthlyRevenueStatisticsChartData(
        monthlyRevenueStatisticsResponse.revenueData
      );
      setMostViewedProductsChartData(mostViewedProductsResponse.productsData);
    } else {
      // Set the error message to the state
      setServerResponse({
        status: false,
        message: "Error fetching data from server",
      });
    }
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
          description={`${todaysSalesSummary.totalOrders} ${
            todaysSalesSummary.totalOrders > 1 ? "Orders" : "Order"
          }`}
          content={convertPriceToBHD(String(todaysSalesSummary.totalRevenue))}
        />

        <SmallWidgetCard
          title={"Pending Orders"}
          description={`${pendingOrders.totalPendingOrders} ${
            pendingOrders.totalPendingOrders > 1
              ? "Pending Orders"
              : "Pending Order"
          }`}
          content={`${convertPriceToBHD(
            String(pendingOrders.totalPendingOrdersRevenue)
          )} revenue`}
        />

        <SmallWidgetCard
          title={"Products Inventory"}
          description={`${productsInventory.totalProducts} Products`}
          content={`${productsInventory.totalActiveProducts} Active Products and ${productsInventory.totalInactiveProducts} Inactive Products`}
        />

        <SmallWidgetCard
          title={"Customer Overview"}
          description={"Total Customers"}
          content={customerOverview.totalCustomers}
        />

        <SmallWidgetCard
          title={"Total Revenue"}
          description={`${totalRevenue.dateDetails}`}
          content={`${convertPriceToBHD(
            String(totalRevenue.totalRevenue)
          )} revenue`}
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
            content={<UsersChart data={signupStatisticsChartData || []} />}
          />
        </ColumnLayout>

        {/* Right Container */}
        <ColumnLayout>
          {/* Sales Graph Widget Section */}

          <MediumWidgetCard
            title={"Monthly Sales"}
            description={"↑ 34% from last month"}
            content={
              <SalesChart data={monthlyRevenueStatisticsChartData || []} />
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
          CardMaxContentHeight={"max-h-[650px]"} // Set max height for content area
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
                data={mostViewedProductsChartData || []}
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

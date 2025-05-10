"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";

// import backend services
import {
  getLastOrders,
  getMostViewedProducts,
  getProductsInventoryStatus,
  getTodaysOrders,
  getTotalPendingOrders,
  getTotalRevenueOfMonth,
  getTotalUsers,
  getMonthlyRevenueStatistics,
  getMonthlyUserSignupStatistics,
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
import { ColumnLayout } from "@/components/(layouts)/ColumnLayout";
import { TwoColumnLayout } from "@/components/(layouts)/TwoColumnLayout";
import { FiveColumnLayout } from "@/components/(layouts)/FiveColumnLayout";

/**
 * @constant Height for Small cards is 160px (widgets)
 * @constant Height for Medium cards is 400px (graphs)
 * @constant Height for Large cards is 600px (orders manager, system status)
 */

export default function dashboardPage() {
  // State to manage loading states
  const [loading, setLoading] = useState(false);

  /**
   * UI Components
   */
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
      loading={loading}
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
      loading={loading}
    />
  );

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
  const [revenueChangePercentage, setRevenueChangePercentage] =
    useState<string>("");
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
      getMonthlyUserSignupStatistics(),
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
      setRevenueChangePercentage(
        monthlyRevenueStatisticsResponse.revenueChange
      );
      setMostViewedProductsChartData(mostViewedProductsResponse.productsData);
    } else {
      // Set the error message to the state
      setServerResponse({
        status: false,
        message:
          "Something went wrong while fetching dashboard data, ask the developer to check the server logs.",
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
            description={revenueChangePercentage}
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
          loading={loading}
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

"use client";

import Link from "next/link";
import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import Card from "@/components/Card";
/**
 * @constant Height for Small cards is 160px (widgets)
 * @constant Height for Medium cards is 300px (graphs)
 * @constant Height for Large cards is 350px (orders manager, system status)
 */

export default function dashboardPage() {
  return (
    // Dashboard Page Layout
    <div className="flex flex-col gap-4">
      {/* Widgets Section 1 Container */}
      <div className="grid grid-cols-5 gap-4 h-[160px]">
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
          CardTitle="Product Inventory Status"
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
          <div>
            <Card
              CardTitle="Total Users"
              CardDescription="↑ 12% from last week"
              CardHight={"h-[300px]"}
            />
          </div>
        </div>

        {/* Right Container */}
        <div className="flex flex-col gap-4">
          {/* Sales Graph Widget Section */}
          <div>
            <Card
              CardTitle="Weekly Sales"
              CardDescription="↑ 34% from last week"
              CardHight={"h-[300px]"}
            />
          </div>
        </div>
      </div>

      {/* Manager Widgets Container */}
      <div className="grid grid-cols-1 gap-4">
        {/* Orders Manager Card */}
        <Card
          CardTitle="Orders Manager"
          CardDescription="Manage Latest Orders"
          CardHight={"h-[500px] md:h-[600px]"}
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

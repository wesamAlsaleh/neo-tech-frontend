"use client";

import Link from "next/link";
import React from "react";

// import custom components
import PageTitle from "@/components/PageTitle";
import { ActionButton } from "@/components/ActionButton";
import Card from "@/components/Card";

export default function dashboardPage() {
  return (
    // Dashboard Page Layout
    <div className="flex flex-col gap-4">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Container */}
        <div className="flex flex-col gap-4">
          {/* Total Users Graph Widget Section */}
          <div>
            <Card
              CardTitle="Total Users"
              CardDescription="↑ 12% from last week"
              CardHight={"h-[200px] md:h-[300px]"}
            />
          </div>
        </div>

        {/* Right Container */}
        <div className="flex flex-col gap-4">
          {/* Sales Graph Widget Section */}
          <div>
            <Card CardTitle="Sales" CardHight={"h-[200px] md:h-[300px]"} />
          </div>
        </div>
      </div>

      {/* Task Manager Widget Section */}
      <div>
        <Card
          CardTitle="Pending Orders"
          CardHight={
            "h-[200px] md:h-[300px] lg:h-[400px] xl:h-[500px] 2xl:h-[600px]"
          }
        />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Container */}
        <div className="flex flex-col gap-4">
          {/* System Status Widget Section */}
          <div>
            <Card CardTitle="System Status" />
          </div>
        </div>

        {/* Right Container */}
        <div className="flex flex-col gap-4">
          {/* Revenue Breakdown Widget Section */}
          <div>
            <Card CardTitle="Revenue Breakdown" />
          </div>
        </div>
      </div>
    </div>
  );
}

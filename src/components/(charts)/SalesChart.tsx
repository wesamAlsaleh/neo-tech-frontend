import { convertPriceToBHD } from "@/lib/helpers";
import React from "react";

// import recharts stuff
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type SalesChartProps = {
  data?: {
    name: string;
    weeklySales: number;
    lastWeekSales: number;
  }[]; // array of objects
};

// Sample data for the chart
const data = [
  { date: "24-1-2025", revenue: 1200 },
  { date: "1-2-2025", revenue: 1500 },
  { date: "12-2-2025", revenue: 1700 },
  { date: "24-3-2025", revenue: 1600 },
  { date: "1-3-2025", revenue: 1800 },
  { date: "12-3-2025", revenue: 2000 },
  { date: "20-3-2025", revenue: 2200 },
  { date: "Today", revenue: 2500 },
];

export default function SalesChart(props: SalesChartProps) {
  return (
    <ResponsiveContainer width="100%" minHeight={250}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFA500" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
          </linearGradient>

          {/* <linearGradient id="colorLastWeekSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D3D3D3" stopOpacity={0.7} />
            <stop offset="95%" stopColor="#D3D3D3" stopOpacity={0} />
          </linearGradient> */}
        </defs>

        <XAxis dataKey="date" />
        <YAxis tickFormatter={(value) => `${value}`} />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          formatter={(value: number) => [
            `${convertPriceToBHD(String(value))}`,
            "Revenue",
          ]}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#FFA500"
          fillOpacity={1}
          fill="url(#colorRevenue)"
        />
        {/* <Area
          type="monotone"
          dataKey="lastWeekSales"
          stroke="#C0C0C0"
          fillOpacity={1}
          fill="url(#colorLastWeekSales)"
        /> */}
      </AreaChart>
    </ResponsiveContainer>
  );
}

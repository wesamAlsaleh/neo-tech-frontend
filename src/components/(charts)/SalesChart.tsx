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
  { name: "Week 1", weeklySales: 1200, lastWeekSales: 1000 },
  { name: "Week 2", weeklySales: 1500, lastWeekSales: 1200 },
  { name: "Week 3", weeklySales: 1700, lastWeekSales: 1500 },
  { name: "Week 4", weeklySales: 1600, lastWeekSales: 1700 },
  { name: "Week 5", weeklySales: 1800, lastWeekSales: 1600 },
  { name: "Week 6", weeklySales: 2000, lastWeekSales: 1800 },
  { name: "Week 7", weeklySales: 2200, lastWeekSales: 2000 },
  { name: "Week 8", weeklySales: 2500, lastWeekSales: 2200 },
];

export default function SalesChart(props: SalesChartProps) {
  return (
    <AreaChart
      width={730}
      height={250}
      data={data}
      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
    >
      <defs>
        <linearGradient id="colorWeeklySales" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#FFA500" stopOpacity={0.8} />
          <stop offset="95%" stopColor="#FFA500" stopOpacity={0} />
        </linearGradient>

        <linearGradient id="colorLastWeekSales" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#D3D3D3" stopOpacity={0.7} />
          <stop offset="95%" stopColor="#D3D3D3" stopOpacity={0} />
        </linearGradient>
      </defs>

      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Area
        type="monotone"
        dataKey="weeklySales"
        stroke="#FFA500"
        fillOpacity={1}
        fill="url(#colorWeeklySales)"
      />
      <Area
        type="monotone"
        dataKey="lastWeekSales"
        stroke="#C0C0C0"
        fillOpacity={1}
        fill="url(#colorLastWeekSales)"
      />
    </AreaChart>
  );
}

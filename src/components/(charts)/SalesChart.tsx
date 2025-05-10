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
  data: {
    month: string; // date in Month Year format (e.g. "Jan 2023")
    revenue: number; // revenue in BHD
  }[]; // array of objects
};

export default function SalesChart(props: SalesChartProps) {
  // Destructure props
  const { data } = props;

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

        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => `${value}`} />
        <CartesianGrid strokeDasharray="2 2" strokeWidth={0.5} />
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

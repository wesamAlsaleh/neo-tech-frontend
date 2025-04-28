import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface MostSelledProductsChartProps {
  data: {
    name: string; // product name
    soldCount: number; // number of products sold
    viewCount: number; // number of products viewed
  }[]; // array of objects
}

export default function MostSelledProductsChart(
  props: MostSelledProductsChartProps
) {
  // Destructure props
  const { data } = props;

  return (
    <ResponsiveContainer width="100%" minHeight={250}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        barSize={30}
      >
        <CartesianGrid strokeDasharray="5 5" />
        <XAxis
          dataKey="name"
          tickFormatter={(name) =>
            name.length > 8 ? `${name.substring(0, 8)}...` : name
          } // truncate long names eg. "12345678abcd" to "12345678..."
          tick={{ fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(value) => `${value} Views`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          cursor={{
            fill: "#F9FFD7",
            stroke: "#B9DD21",
            strokeWidth: 2,
            strokeDasharray: "3 3",
            opacity: 0.8,
          }}
        />
        <Legend
          wrapperStyle={{
            marginTop: 60, // move the legend 20px lower
          }}
        />
        <Bar dataKey="soldCount" fill="#00BCEE" />
        <Bar dataKey="viewCount" fill="#B9DD21" />
      </BarChart>
    </ResponsiveContainer>
  );
}

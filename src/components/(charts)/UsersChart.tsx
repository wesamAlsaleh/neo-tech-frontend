"use client";

import React from "react";

// import recharts stuff
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type UsersChartProps = {
  data: {
    growth: number;
    week: string;
  }[]; // array of objects
};

export default function UsersChart(props: UsersChartProps) {
  // destructure props
  const { data } = props;

  return (
    <ResponsiveContainer width="100%" minHeight={250}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="week" />
        <YAxis />
        <Tooltip />
        <Line
          dataKey="growth"
          type="monotone"
          stroke="var(--primary)"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

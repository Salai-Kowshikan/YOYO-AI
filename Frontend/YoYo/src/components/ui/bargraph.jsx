import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

// Define colors for different types
const COLORS = {
  SUV: "#8884d8",
  Sedan: "#82ca9d",
  Hatchback: "#ffc658",
  // Add more colors as needed
};

export function Bargraph({ data }) {
  // Convert the data from object format to an array of objects
  const barData = React.useMemo(() => {
    // Handle both arrays and strings in data
    return Object.entries(data).map(([key, value]) => ({
      name: key,
      value: Array.isArray(value)
        ? value.length
        : typeof value === "string"
        ? value.length
        : value,
    }));
  }, [data]);

  if (barData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Graph</CardTitle>
        <CardDescription>Distribution by Type</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart width={500} height={300} data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            label={{ value: "Type", position: "insideBottom", dy: 10 }}
          />
          <YAxis
            label={{
              value: "Count",
              angle: -90,
              position: "insideLeft",
              dx: 10,
            }}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" radius={4}>
            {barData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name] || "#8884d8"}
              />
            ))}
          </Bar>
        </BarChart>
      </CardContent>
    </Card>
  );
}

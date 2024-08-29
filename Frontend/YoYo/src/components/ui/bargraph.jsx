import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function Bargraph({ data }) {
  const COLORS = {
    SUV: "#8884d8",
    Sedan: "#82ca9d",
    Hatchback: "#ffc658",
  };

  const barData = Object.keys(data).map((key) => ({
    name: key,
    value: data[key],
  }));

  // Extract unique car types from barData to filter COLORS
  const displayedCarTypes = new Set(barData.map((item) => item.name));

  const filteredColors = Object.entries(COLORS).filter(([key]) =>
    displayedCarTypes.has(key)
  );

  if (barData.length === 0) {
    return <div>No data available</div>;
  }

  useEffect(() => {
    console.table(barData);
  }, [barData]);

  const renderCustomLegend = () => (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}
    >
      {filteredColors.map(([key, color]) => (
        <div
          key={key}
          style={{ display: "flex", alignItems: "center", margin: "0 10px" }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: color,
              marginRight: 5,
            }}
          />
          <span>{key}</span>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Graph</CardTitle>
        <CardDescription>Car Type Preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              label={{ value: "Car Type", position: "insideBottom", dy: 8 }}
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
            <Bar dataKey="value" radius={4}>
              {barData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.name] || "#8884d8"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        {renderCustomLegend()}
      </CardContent>
    </Card>
  );
}

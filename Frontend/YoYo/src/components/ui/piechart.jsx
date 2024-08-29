import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Sector,
  Label,
  Tooltip as ChartTooltip,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Define colors for different types (you can customize these colors)
const COLORS = {
  White: "#8884d8",
  Red: "#82ca9d",
  Black: "#ffc658",
  Blue: "#ff7300",
  Green: "#ff0000",
  Yellow: "#00ff00",
  Purple: "#0000ff",
  Orange: "#ff00ff",
  Brown: "#00ffff",
  Pink: "#ff0000",
  Grey: "#00ff00",
  Cyan: "#ff00ff",
  // Add more colors as needed for other keys
};

export function Piechart({ data }) {
  // Convert the data from object format to an array of objects
  const chartData = React.useMemo(() => {
    return Object.keys(data).map((key) => ({
      type: key,
      count: data[key],
    }));
  }, [data]);

  const [activeType, setActiveType] = React.useState(
    chartData.length > 0 ? chartData[0].type : ""
  );

  const activeIndex = React.useMemo(() => {
    if (chartData.length === 0) return 0;
    const index = chartData.findIndex((item) => item.type === activeType);
    return index >= 0 ? index : 0;
  }, [activeType, chartData]);

  const types = React.useMemo(
    () => chartData.map((item) => item.type),
    [chartData]
  );

  const chartConfig = React.useMemo(() => {
    return chartData.reduce((acc, item) => {
      acc[item.type] = {
        label: item.type,
      };
      return acc;
    }, {});
  }, [chartData]);

  console.table(chartData);

  if (chartData.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <Card data-chart="pie-interactive" className="flex flex-col">
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Pie Chart</CardTitle>
          <CardDescription>Distribution by Color</CardDescription>
        </div>
        <Select value={activeType} onValueChange={setActiveType}>
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {types.map((key) => {
              const config = chartConfig[key];
              if (!config) return null;
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{
                        backgroundColor: COLORS[key] || "#8884d8",
                      }}
                    />
                    {config?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <div className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart width={300} height={300}>
            <ChartTooltip cursor={false} content={<div />} />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              outerRadius={100}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.type] || "#8884d8"}
                />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const count =
                      (chartData[activeIndex] &&
                        chartData[activeIndex].count) ||
                      0;
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {count.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Colours
                        </tspan>
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </div>
      </CardContent>
    </Card>
  );
}

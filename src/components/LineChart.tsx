"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
} from "recharts";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Telemetry = {
  siteId: string;
  ts: number;
  soc: number;
  powerKw: number;
  gridStatus: "OK" | "OUTAGE";
};

export function ChartLineLinear({ telemetry }: { telemetry: Telemetry }) {
  const [chartData, setChartData] = useState<
    { time: string; power: number; soc: number }[]
  >([]);

  // Append new telemetry point each time data updates
  useEffect(() => {
    const now = new Date(telemetry.ts);
    const timeLabel = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    setChartData((prev) => {
      const updated = [
        ...prev,
        { time: timeLabel, power: telemetry.powerKw, soc: telemetry.soc },
      ];
      // Keep only last 60 seconds (≈ 60 points)
      return updated.slice(-60);
    });
  }, [telemetry]);

  const chartConfig = {
    power: {
      label: "Power (kW)",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className="w-full shadow-md border border-gray-100">
      <CardHeader>
        <CardTitle>Live Power Output</CardTitle>
        <CardDescription>Last 60 seconds</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]" config={chartConfig}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={30}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                type="monotone"
                dataKey="power"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={false}
                isAnimationActive={true}
              />
              <Line
                type="monotone"
                dataKey="soc"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
              />
            </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="flex gap-2 font-medium text-green-600">
          Trending live <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground">
          Updates every 1 second — Power (green) & SOC (blue)
        </div>
      </CardFooter>
    </Card>
  );
}

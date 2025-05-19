"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import moment from "moment";

export const description = "A bar chart with a label";

// const chartDataExample = [
//   { date: "Monday", sales: 186 },
//   { date: "Tuesday", sales: 305 },
//   { date: "Wednesday", sales: 111 },
//   { date: "Thursday", sales: 73 },
//   { date: "Friday", sales: 219 },
//   { date: "Saturday", sales: 124 },
//   { date: "Sunday", sales: 186 },
// ]

export default function BarChartComp({ 
  chartData, 
  color, 
  // title, 
  // description
 }: any) {
  const chartConfig = {
    sales: {
      label: "sales",
      color: color || "hsl(var(--primary))",
    },
  } satisfies ChartConfig;
  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle>{title}</CardTitle>
    //     <CardDescription> {description} </CardDescription>
    //   </CardHeader>
    //   <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => moment(value).format('MMM YY') }
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="sales" fill="var(--color-sales)" radius={8}>
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
    //   </CardContent>
    //   <CardFooter className="flex-col items-start gap-2 text-sm">
    //     <div className="flex gap-2 font-medium leading-none">
    //       Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    //     </div>
    //     <div className="leading-none text-muted-foreground">
    //       Showing total visitors for the last 6 months
    //     </div>
    //   </CardFooter>
    // </Card>
  );
}

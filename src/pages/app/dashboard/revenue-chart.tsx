import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import colors from "tailwindcss/colors";

import { getDailyRevenueInPeriod } from "@/api/get-daily-revenue-in-period";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Skeleton } from "@/components/ui/skeleton";

export function RevenueChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const { data: dailyRevenueInPeriod } = useQuery({
    queryKey: ["metrics", "daily-revenue-in-period", dateRange],
    queryFn: () =>
      getDailyRevenueInPeriod({
        from: dateRange?.from,
        to: dateRange?.to,
      }),
  });

  /**
   * O endpoint retorna a receita em centavos, então aqui converto para reais dividindo por 100.
   *
   * O useMemo é usado para evitar fazer essa conversão toda vez que o componente renderizar,
   * fazendo apenas quando os dados realmente mudarem.
   */
  const chartData = useMemo(() => {
    if (!dailyRevenueInPeriod) return [];

    return dailyRevenueInPeriod.map((item) => ({
      ...item,
      date: item.date,
      receipt: item.receipt / 100,
    }));
  }, [dailyRevenueInPeriod]);

  return (
    <Card className="col-span-6">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Receita no período
          </CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker date={dateRange} onDateChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        {dailyRevenueInPeriod ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={chartData} style={{ fontSize: 12 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} dy={16} />

              <YAxis
                stroke="#888"
                axisLine={false}
                tickLine={false}
                width={80}
                tickFormatter={(value: number) =>
                  value.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })
                }
              />

              <CartesianGrid vertical={false} className="stroke-muted" />

              <Tooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="border-border bg-card text-card-foreground rounded-lg border p-2 shadow-sm">
                        <span className="text-muted-foreground block text-xs">
                          {label}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="dark:text-foreground text-foreground text-sm font-bold">
                            {Number(payload[0].value).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="linear"
                strokeWidth={2}
                dataKey="receipt"
                stroke={colors.violet[500]}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Skeleton className="h-60 w-full" />
        )}
      </CardContent>
    </Card>
  );
}

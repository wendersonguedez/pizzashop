import { useQuery } from "@tanstack/react-query";
import { DollarSign } from "lucide-react";

import { getMonthRenevue } from "@/api/get-month-revenue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MonthRevenueCard() {
  const { data: getMonthRevenueAmount } = useQuery({
    queryFn: getMonthRenevue,
    queryKey: ["metrics", "month-revenue"],
  });

  if (!getMonthRevenueAmount) return null;

  const amountFormatted = getMonthRevenueAmount.receipt.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-sm font-medium">
          {" "}
          Receita total (mês)
        </CardTitle>
        <DollarSign className="text-muted-foreground h-4 w-4" />
      </CardHeader>

      <CardContent className="space-y-1 pt-0">
        {getMonthRevenueAmount && (
          <>
            <span className="text-2xl font-bold tracking-tight">
              {amountFormatted}
            </span>
            <p className="text-muted-foreground text-xs">
              {getMonthRevenueAmount.diffFromLastMonth >= 0 ? (
                <>
                  <span className="text-emerald-500 dark:text-emerald-400">
                    +{getMonthRevenueAmount.diffFromLastMonth}%
                  </span>{" "}
                  em relação ao mês passado
                </>
              ) : (
                <>
                  <span className="text-rose-500 dark:text-rose-400">
                    {getMonthRevenueAmount.diffFromLastMonth}%
                  </span>{" "}
                  em relação ao mês passado
                </>
              )}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

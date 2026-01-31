import { Utensils } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function DayOrdersAmountCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
        <CardTitle className="text-sm font-medium"> Pedidos (dia)</CardTitle>
        <Utensils className="text-muted-foreground h-4 w-4" />
      </CardHeader>

      <CardContent className="space-y-1 pt-0">
        <span className="text-2xl font-bold tracking-tight">12</span>
        <p className="text-muted-foreground text-xs">
          <span className="text-rose-500 dark:text-rose-400">-4%</span> em
          relação a ontem
        </p>
      </CardContent>
    </Card>
  );
}

import { useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Search, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { cancelOrder } from "@/api/cancel-order";
import type { GetOrdersResponse } from "@/api/get-orders";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { OrderStatus } from "@/components/ui/order-status";
import { TableCell, TableRow } from "@/components/ui/table";
import { queryClient } from "@/lib/react-query";

import { OrderDetails } from "./order-details";

interface OrderTableRowProps {
  orderId: string;
  createdAt: string;
  status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
  customerName: string;
  total: number;
}

export function OrderTableRow({
  orderId,
  createdAt,
  status,
  customerName,
  total,
}: OrderTableRowProps) {
  const formattedTotal = (total / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutateAsync: cancelOrderFn } = useMutation({
    mutationFn: cancelOrder,
    onSuccess: (_, { orderId }) => {
      const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
        queryKey: ["orders"],
      });

      if (ordersListCache) {
        ordersListCache.forEach(([cacheKey, cacheData]) => {
          if (!cacheData) return;

          /**
           * Atualiza o cache dos pedidos para refletir a mudança de status do pedido cancelado. Ele percorre os pedidos no cache e, se encontrar o pedido com o ID correspondente (orderId),
           * atualiza seu status para "canceled". Isso garante que a interface do usuário seja atualizada imediatamente após o cancelamento, sem a necessidade de refazer a consulta ao backend.
           *
           * Caso não seja o pedido em questão, ele mantém os dados inalterados. Essa abordagem é eficiente e mantém a consistência dos dados na interface do usuário, proporcionando uma melhor experiência para o usuário final.
           */
          queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
            ...cacheData,
            orders: cacheData.orders.map((order) =>
              order.orderId === orderId
                ? { ...order, status: "canceled" }
                : order,
            ),
          });

          toast.success("Pedido cancelado com sucesso.");
        });
      }
    },
  });

  return (
    <TableRow>
      <TableCell>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="xs">
              <Search className="h-3 w-3" />
              <span className="sr-only">Detalhes do pedido</span>
            </Button>
          </DialogTrigger>

          <OrderDetails orderId={orderId} open={isDialogOpen} />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">{orderId}</TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(createdAt, {
          addSuffix: true,
          locale: ptBR,
        })}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <OrderStatus status={status} />
        </div>
      </TableCell>
      <TableCell className="font-medium">{customerName}</TableCell>
      <TableCell className="font-medium">{formattedTotal}</TableCell>
      <TableCell>
        <Button variant="outline" size="xs">
          <ArrowRight className="mr-2 h-3 w-3" />
          Aprovar
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="xs"
          disabled={!["pending", "processing"].includes(status)}
          onClick={() => cancelOrderFn({ orderId })}
        >
          <X className="mr-2 h-3 w-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  );
}

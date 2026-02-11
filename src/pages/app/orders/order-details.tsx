import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { ptBR } from "date-fns/locale/pt-BR";

import { getOrderDetails } from "@/api/get-order-details";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderStatus } from "@/components/ui/order-status";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface OrderDetailsProps {
  orderId: string;
  open: boolean;
}

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
  /**
   * Uso do React Query para buscar os detalhes do pedido. A query é ativada apenas quando o modal está aberto,
   * evitando chamadas desnecessárias à API quando o modal não está sendo exibido.
   */
  const { data: orderDetails } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => getOrderDetails({ orderId }),
    enabled: open,
  });

  const formattedDateOrders =
    orderDetails?.createdAt &&
    formatDistanceToNow(orderDetails.createdAt, {
      addSuffix: true,
      locale: ptBR,
    });

  const formattedTotalOrder =
    orderDetails?.totalInCents &&
    (orderDetails.totalInCents / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

  if (!orderDetails) {
    return null;
  }

  return (
    <div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pedido: {orderId}</DialogTitle>
          <DialogDescription>Detalhes do pedido</DialogDescription>
        </DialogHeader>

        {orderDetails && (
          <div className="space-y-6">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Status
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <div className="flex items-center gap-2">
                      {orderDetails?.status && (
                        <OrderStatus status={orderDetails.status} />
                      )}
                    </div>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Cliente
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {orderDetails?.customer.name}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Telefone
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {orderDetails?.customer.phone ?? "Não informado"}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">Email</TableCell>
                  <TableCell className="flex justify-end">
                    {orderDetails?.customer.email.toLocaleLowerCase()}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="text-muted-foreground">
                    Realizado há
                  </TableCell>
                  <TableCell className="flex justify-end">
                    {formattedDateOrders}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Preço</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.orderItems.map((order) => {
                  const subtotal = order.priceInCents * (order.quantity ?? 0);

                  const formattedPrice = (
                    order.priceInCents / 100
                  ).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  });

                  const formattedSubtotal = (subtotal / 100).toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    },
                  );

                  return (
                    <TableRow key={order.id}>
                      <TableCell>{order.product.name}</TableCell>
                      <TableCell className="text-right">
                        {order.quantity ?? 0}
                      </TableCell>
                      <TableCell className="text-right">
                        {formattedPrice}
                      </TableCell>
                      <TableCell className="text-right">
                        {formattedSubtotal}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total do pedido</TableCell>
                  <TableCell className="text-right font-medium">
                    {formattedTotalOrder}
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        )}
      </DialogContent>
    </div>
  );
}

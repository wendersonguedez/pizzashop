export const orderStatusArray = [
  "pending",
  "canceled",
  "processing",
  "delivering",
  "delivered",
] as const;

export type OrderStatus = (typeof orderStatusArray)[number];

interface OrderStatusProps {
  status: OrderStatus;
}

export function OrderStatus({ status }: OrderStatusProps) {
  /**
   * Mapeamento do status do pedido para cores. Isso centraliza a lógica de cores e facilita a manutenção futura,
   * caso seja necessário adicionar novos status ou alterar as cores existentes.
   */
  const statusColors: Record<OrderStatus, string> = {
    pending: "bg-yellow-500",
    canceled: "bg-rose-500",
    processing: "bg-amber-500",
    delivering: "bg-amber-500",
    delivered: "bg-green-500",
  };

  /**
   * Mapeamento do status do pedido para texto legível. Isso facilita a manutenção e a tradução futura, caso necessário.
   */
  const orderStatusText: Record<OrderStatus, string> = {
    pending: "Pendente",
    canceled: "Cancelado",
    processing: "Em processamento",
    delivering: "Em entrega",
    delivered: "Entregue",
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
      <span className="text-muted-foreground font-medium">
        {orderStatusText[status]}
      </span>
    </div>
  );
}

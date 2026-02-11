import type { OrderStatus } from "@/components/ui/order-status";
import { api } from "@/lib/axios";

interface CancelOrderParams {
  orderId: string;
}

interface CancelOrderResponse {
  id: string;
  status: OrderStatus;
  createdAt: string;
  totalInCents: number;
  customer: {
    name: string;
    email: string;
    phone: string | null;
  };
  orderItems: {
    id: string;
    priceInCents: number;
    quantity: number | null;
    product: {
      name: string;
    };
  }[];
}

export async function cancelOrder({ orderId }: CancelOrderParams) {
  const response = await api.get<CancelOrderResponse>(`/orders/${orderId}`);

  return response.data;
}

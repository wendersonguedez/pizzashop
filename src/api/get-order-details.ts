import type { OrderStatusType } from "@/components/ui/order-status";
import { api } from "@/lib/axios";

interface GetOrderParams {
  orderId: string;
}

interface GetOrderResponse {
  id: string;
  status: OrderStatusType;
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

export async function getOrderDetails({ orderId }: GetOrderParams) {
  const response = await api.get<GetOrderResponse>(`/orders/${orderId}`);

  return response.data;
}

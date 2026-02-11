import type { OrderStatus } from "@/components/ui/order-status";
import { api } from "@/lib/axios";

interface GetOrderDetailsParams {
  orderId: string;
}

interface GetOrderDetailsResponse {
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

export async function getOrderDetails({ orderId }: GetOrderDetailsParams) {
  const response = await api.get<GetOrderDetailsResponse>(`/orders/${orderId}`);

  return response.data;
}

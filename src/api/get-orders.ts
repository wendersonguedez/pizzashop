import type { OrderStatus } from "@/components/ui/order-status";
import { api } from "@/lib/axios";

interface GetOrdersParams {
  pageIndex?: number | null;
  orderId?: string | null;
  customerName?: string | null;
  status?: OrderStatus | "all" | null;
}

export interface GetOrdersResponse {
  orders: {
    orderId: string;
    createdAt: string;
    status: "pending" | "canceled" | "processing" | "delivering" | "delivered";
    customerName: string;
    total: number;
  }[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}

/**
 * Busca os pedidos do backend com base nos parâmetros fornecidos.
 *
 * @param {GetOrdersParams} params - Os parâmetros para filtrar os pedidos, sendo pageIndex, orderId, customerName e status.
 * @returns {Promise<GetOrdersResponse>} - A resposta contendo os pedidos e os metadados de paginação.
 */
export async function getOrders({
  pageIndex = 0,
  ...params
}: GetOrdersParams): Promise<GetOrdersResponse> {
  const response = await api.get<GetOrdersResponse>("/orders", {
    params: {
      pageIndex,
      ...params,
    },
  });

  return response.data;
}

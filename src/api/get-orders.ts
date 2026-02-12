import type { OrderStatusType } from "@/components/ui/order-status";
import { api } from "@/lib/axios";

interface GetOrdersParams {
  pageIndex?: number | null;
  orderId?: string | null;
  customerName?: string | null;
  status?: OrderStatusType | "all" | null;
}

export interface GetOrdersResponse {
  orders: {
    orderId: string;
    createdAt: string;
    status: OrderStatusType;
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

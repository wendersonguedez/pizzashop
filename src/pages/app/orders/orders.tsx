import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router";
import { z } from "zod";

import { getOrders } from "@/api/get-orders";
import { Pagination } from "@/components/pagination";
import {
  orderStatusArray,
  type OrderStatusType,
} from "@/components/ui/order-status";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { OrderTableFilters } from "./order-table-filters";
import { OrderTableRow } from "./order-table-row";
import { OrderTableSkeleton } from "./order-table-skeleton";

export function Orders() {
  const [searchParams, setSearchParams] = useSearchParams();

  const orderId = searchParams.get("orderId") ?? "";
  const customerName = searchParams.get("customerName") ?? "";

  const status = searchParams.get("status");

  const isValidStatus =
    status && orderStatusArray.includes(status as OrderStatusType);

  const finalStatus = isValidStatus ? (status as OrderStatusType) : "all";

  /**
   * O backend espera um pageIndex baseado em zero, mas a interface do usuário é baseada em um pageIndex baseado em um.
   * Portanto, precisamos subtrair 1 do pageIndex antes de enviá-lo para o backend. Se o pageIndex não for fornecido, assumimos que é 0 (primeira página).
   *
   * Exemplo:
   * - Se o usuário estiver na página 1, o pageIndex será 1, mas o backend espera 0, então subtraímos 1 para obter 0.
   * - Se o usuário estiver na página 2, o pageIndex será 2, mas o backend espera 1, então subtraímos 1 para obter 1.
   * - Se o usuário estiver na página 3, o pageIndex será 3, mas o backend espera 2, então subtraímos 1 para obter 2.
   * E assim por diante...
   *
   * Além disso, se o usuário fornecer um pageIndex menor ou igual a 0, definimos o pageIndex para 0 para evitar valores negativos.
   */
  const pageIndex = z.coerce
    .number()
    .transform((page) => (page <= 0 ? 0 : page - 1))
    .parse(searchParams.get("page") ?? 0);

  const { data: result, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders", pageIndex, orderId, customerName, finalStatus],
    queryFn: () =>
      getOrders({
        pageIndex,
        orderId,
        customerName,
        status: finalStatus === "all" ? null : finalStatus,
      }),
  });

  return (
    <>
      <Helmet title="Pedidos" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
        <div className="space-y-2.5">
          <OrderTableFilters />

          <div className="rouded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16"></TableHead>
                  <TableHead className="w-35">Identificador</TableHead>
                  <TableHead className="w-35">Realizado há</TableHead>
                  <TableHead className="w-35">Status</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="w-35">Total do pedido</TableHead>
                  <TableHead className="w-41"></TableHead>
                  <TableHead className="w-33"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingOrders ? (
                  <OrderTableSkeleton />
                ) : result && result.orders && result.orders.length > 0 ? (
                  result.orders.map((order) => (
                    <OrderTableRow key={order.orderId} {...order} />
                  ))
                ) : (
                  <TableRow>
                    <TableHead className="text-center" colSpan={8}>
                      Nenhum pedido encontrado.
                    </TableHead>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {result && (
            <Pagination
              onPageChange={(pageIndex) => {
                setSearchParams((prev) => {
                  prev.set("page", (pageIndex + 1).toString());

                  return prev;
                });
              }}
              pageIndex={result.meta.pageIndex}
              totalCount={result.meta.totalCount}
              perPage={result.meta.perPage}
            />
          )}
        </div>
      </div>
    </>
  );
}

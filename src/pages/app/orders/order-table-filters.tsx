import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { orderStatusArray } from "@/components/ui/order-status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const orderFilterSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.enum([...orderStatusArray, "all"] as const).optional(),
});

type OrderFilterSchemaType = z.infer<typeof orderFilterSchema>;

export function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const orderId = searchParams.get("orderId") ?? "";
  const customerName = searchParams.get("customerName") ?? "";
  const status =
    (searchParams.get("status") as OrderFilterSchemaType["status"]) || "all";

  const { register, handleSubmit, control, reset } =
    useForm<OrderFilterSchemaType>({
      resolver: zodResolver(orderFilterSchema),
      defaultValues: {
        orderId,
        customerName,
        status,
      },
    });

  /**
   * Atualiza os parâmetros de busca na URL com base nos filtros aplicados.
   * Se um filtro estiver vazio ou for "all", ele será removido dos parâmetros de busca.
   *
   * @param {OrderFilterSchemaType} filters - Os filtros aplicados pelo usuário.
   */
  function handleFilter({
    orderId,
    customerName,
    status,
  }: OrderFilterSchemaType) {
    setSearchParams((prev) => {
      if (orderId) {
        prev.set("orderId", orderId);
      } else {
        prev.delete("orderId");
      }

      if (customerName) {
        prev.set("customerName", customerName);
      } else {
        prev.delete("customerName");
      }

      if (status && status !== "all") {
        prev.set("status", status);
      } else {
        prev.delete("status");
      }

      prev.set("page", "1");

      return prev;
    });
  }

  function handleClearFilters() {
    setSearchParams((prev) => {
      prev.delete("orderId");
      prev.delete("customerName");
      prev.delete("status");
      prev.set("page", "1");

      return prev;
    });

    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex items-center gap-2"
    >
      <span className="text-sm font-semibold">Filtros:</span>
      <Input
        placeholder="ID do pedido"
        className="h-8 w-auto"
        {...register("orderId")}
      />
      <Input
        placeholder="Nome do cliente"
        className="h-8 w-[320px]"
        {...register("customerName")}
      />

      <Controller
        name="status"
        control={control}
        render={({ field: { onChange, value, ...field } }) => {
          return (
            <Select
              onValueChange={(value) => onChange(value)}
              defaultValue="all"
              value={value}
              {...field}
            >
              <SelectTrigger className="h-8 w-45">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="canceled">Cancelado</SelectItem>
                <SelectItem value="processing">Em preparo</SelectItem>
                <SelectItem value="delivering">Em entrega</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
              </SelectContent>
            </Select>
          );
        }}
      />

      <Button type="submit" variant="secondary" size="xs">
        <Search className="mr-2 h-4 w-4" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={handleClearFilters}
      >
        <X className="mr-2 h-4 w-4" />
        Remover filtros
      </Button>
    </form>
  );
}

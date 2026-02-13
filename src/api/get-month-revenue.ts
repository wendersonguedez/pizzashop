import { api } from "@/lib/axios";

interface GetMonthRenevueResponse {
  receipt: number;
  diffFromLastMonth: number;
}

export async function getMonthRenevue() {
  const response = await api.get<GetMonthRenevueResponse>(
    "/metrics/month-receipt",
  );

  return response.data;
}

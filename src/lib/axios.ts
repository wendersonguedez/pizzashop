import axios from "axios";

import { env } from "@/env";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

/**
 * Irá interceptar todas as requisições e adicionar um delay de 1 segundo
 * caso a variável de ambiente VITE_ENABLE_API_DELAY esteja habilitada.
 *
 * Isso é útil para simular latência de rede durante o desenvolvimento.
 *
 * Por fim, irá retornar a configuração da requisição para que ela prossiga normalmente.
 */
if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });

    return config;
  });
}

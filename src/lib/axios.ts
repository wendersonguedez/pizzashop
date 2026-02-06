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

/**
 * Interceptor de Erros (Fault Injection)
 * Permite testar interfaces otimistas e tratamentos de erro.
 *
 * Se a variável de ambiente VITE_ENABLE_API_ERROR estiver habilitada, o interceptor irá simular um erro para todas as requisições.
 *
 * Caso a variável de ambiente VITE_API_ERROR_TARGET esteja definida, o interceptor irá simular o erro apenas para as
 * requisições cujo URL contenha o valor definido nessa variável.
 * O erro é simulado após um delay de 3 segundos para permitir testar os estados de loading e erro da aplicação.
 *
 * Exemplo de uso:
 * - Para simular erro em todas as requisições:
 *   VITE_ENABLE_API_ERROR=true
 *
 * - Para simular erro apenas nas requisições que contenham "profile" na URL:
 *   VITE_ENABLE_API_ERROR=true
 *   VITE_API_ERROR_TARGET=profile
 */
if (env.VITE_ENABLE_API_ERROR) {
  api.interceptors.request.use(async (config) => {
    if (
      env.VITE_API_ERROR_TARGET &&
      !config.url?.includes(env.VITE_API_ERROR_TARGET)
    ) {
      return config;
    }

    // Simula um erro no endpoint definido no VITE_API_ERROR_TARGET ou em todas as requisições se o target não for definido.
    await new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `Erro simulado via interceptador de erros (Target: ${env.VITE_API_ERROR_TARGET || "ALL"})`,
          ),
        );
      }, 3000);
    });

    return config;
  });
}

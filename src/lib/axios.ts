import axios from "axios";

import { env } from "@/env";

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  withCredentials: true,
});

/**
 * Irá interceptar todas as requisições e adicionar um delay aleatório entre 0 e 3 segundos, mas somente
 * caso a variável de ambiente VITE_ENABLE_API_DELAY esteja habilitada.
 *
 * Isso é útil para simular latência de rede durante o desenvolvimento.
 *
 * Por fim, irá retornar a configuração da requisição para que ela prossiga normalmente.
 */
if (env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) => {
      setTimeout(resolve, Math.round(Math.random() * 3000));
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

/**
 * Interceptador de Resposta Global (Tratamento de Autenticação)
 *
 * Este interceptador monitora erros nas respostas da API. Se identificar um erro 401 (Unauthorized)
 * com o código específico "UNAUTHORIZED", ele assume que a sessão do usuário expirou.
 *
 * Fluxo de tratamento (Flash Message Pattern):
 * 1. Persistência: Grava uma flag no localStorage ('@pizzashop:auth-error') para indicar que houve erro de auth.
 * Isso é necessário porque o redirecionamento abaixo fará um "Hard Reload", limpando a memória do JS.
 *
 * 2. Redirecionamento: Força a navegação para '/sign-in' via window.location.href.
 * Isso garante que estados antigos (React Query, Contexts) sejam destruídos, evitando vazamento de dados.
 *
 * A exibição visual do erro (Toast) é responsabilidade da página de Login (ou hook useFlashMessage),
 * que consumirá a flag do localStorage assim que a página carregar.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "UNAUTHORIZED"
    ) {
      localStorage.setItem("@pizzashop:auth-error", "true");

      window.location.href = "/sign-in";
    }

    return Promise.reject(error);
  },
);

import { z } from "zod";

/**
 * VITE_ENABLE_API_DELAY: Como o .env retorna todas as variáveis como string,
 * precisamos transformar o valor "true" em boolean true e qualquer outro valor em false,
 * pois a string 'false' seria considerada true em um contexto booleano.
 */
const envSchema = z.object({
  VITE_API_URL: z.url(),
  VITE_ENABLE_API_DELAY: z.string().transform((value) => value === "true"),
});

/**
 * Valida se as variáveis de ambiente seguem o formato definido no envSchema.
 * Se alguma variável estiver faltando ou incorreta, a aplicação dispara um erro e não inicia.
 */
export const env = envSchema.parse(import.meta.env);

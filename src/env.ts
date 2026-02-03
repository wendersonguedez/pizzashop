import { z } from "zod";

const envSchema = z.object({
  VITE_API_URL: z.url(),
});

/**
 * Valida se as variáveis de ambiente seguem o formato definido no envSchema.
 * Se alguma variável estiver faltando ou incorreta, a aplicação dispara um erro e não inicia.
 */
export const env = envSchema.parse(import.meta.env);

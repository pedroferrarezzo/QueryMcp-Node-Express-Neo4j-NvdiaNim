import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  MCP_CLIENT_WS_ENDPOINT: z.string().min(1, "WebSocket endpoint is required").default("/ws"),
  MCP_CLIENT_PORT: z.coerce.number().default(3000),
  QUERY_MCP_SERVER_ENDPOINT: z.string().min(1, "Query MCP server endpoint is required"),
  LLM_API_KEY: z.string().min(1, "API key is required"),
  LLM_MODEL: z.string().min(1, "Model is required"),
  LLM_BASE_URL: z.string().min(1, "Base URL is required"),
});

type Env = z.infer<typeof envSchema>;

/**
 * Valida se as variáveis de ambiente necessárias estão definidas.
 */
function validateEnv(): Env {
  return envSchema.parse(process.env);
}

/**
 * Exporta as variáveis de ambiente.
 */
export const ENV: Env = validateEnv();
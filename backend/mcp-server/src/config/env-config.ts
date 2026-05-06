import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  MCP_SERVER_ENDPOINT: z.string().min(1, "MCP server endpoint is required").default("/mcp"),
  MCP_SERVER_PORT: z
    .coerce
    .number()
    .default(3001),
  URI_NEO4J: z.url(),
  USER_NEO4J: z.string().min(1, "USER_NEO4J is required"),
  PASSWORD_NEO4J: z.string().min(1, "PASSWORD_NEO4J is required"),
  EMAIL_HOST: z.string().min(1, "EMAIL_HOST is required"),
  EMAIL_PORT: z.coerce.number().min(1, "EMAIL_PORT is required"),
  EMAIL_SECURE: z.preprocess(
    (val) => val === "true" || val === "True" ? true : val === "false" || val === "False" ? false : val,
    z.boolean()
  ),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  EMAIL_FROM: z.email(),
});

type Env = z.infer<typeof envSchema>;

/**
 * Valida se as variáveis de ambiente necessárias estão definidas.
 */
function validateEnv(): Env {
  const result = envSchema.parse(process.env);

  return result;
}

/** Exporta as variáveis de ambiente.
 */
export const ENV: Env = validateEnv();
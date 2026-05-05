import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  MCP_SERVER_ENDPOINT: z.string().default("/mcp"),
  MCP_SERVER_PORT: z
    .coerce
    .number()
    .default(3001),
  NEO4J_URI: z.url(),
  NEO4J_USER: z.string(),
  NEO4J_PASSWORD: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.coerce.number(),
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
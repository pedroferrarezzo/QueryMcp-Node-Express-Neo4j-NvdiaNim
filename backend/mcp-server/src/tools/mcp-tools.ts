import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { DbRepository } from "../infrastructure/output/repository/db-repository";
import { EmailClient } from "../infrastructure/output/email/email-client";

/**
 * Registra as ferramentas disponíveis no MCP Server
 * @param server instância do MCP Server
 * @param deps dependências externas
 */
export function registerTools(
  server: McpServer,
  deps: {
    dbRepository: DbRepository;
    emailClient: EmailClient;
  }
) {
  /**
   * Retorna o schema do banco
   */
  server.tool(
    "get_db_schema",
    "Retorna o schema do banco de dados",
    {},
    async () => {
      console.debug("Tool 'get_db_schema' called. Fetching database schema...");
      const schema = await deps.dbRepository.getSchema();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(schema, null, 2),
          },
        ],
      };
    }
  );

  /**
   * Executa uma query no banco
   */
  server.tool(
    "execute_query",
    "Executa uma query no banco de dados",
    {
      query: z.string().min(1, "Query obrigatória"),
      params: z.record(z.string(), z.any()).optional(),
    },
    async ({ query, params }) => {
      console.debug("Tool 'execute_query' called. Executing query: ", query, " with params: ", params);
      const result = await deps.dbRepository.executeQuery(query, params);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  /**
   * Envia um e-mail
   */
  server.tool(
    "send_email",
    "Envia um e-mail",
    {
      to: z.union([z.email(), z.array(z.email())]),
      subject: z.string(),
      body: z.string(),
    },
    async ({ to, subject, body }) => {
      console.debug("Tool 'send_email' called. Sending email to: ", to);
      await deps.emailClient.sendEmail(to, subject, body);

      return {
        content: [
          {
            type: "text",
            text: "E-mail enviado com sucesso",
          },
        ],
      };
    }
  );
}
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";

/**
 * Obtém as ferramentas disponíveis no MCP e as converte para o formato esperado pelo Langchain.
 * @param mcpClient Cliente MCP conectado
 * @returns {Promise<DynamicStructuredTool[]>} Lista de ferramentas no formato Langchain
 */
export async function getLangchainToolsFromMcp(
  mcpClient: Client
): Promise<
  DynamicStructuredTool<
    {
      [x: string]: unknown;
      type: "object";
      properties?: Record<string, object> | undefined;
      required?: string[] | undefined;
    },
    unknown,
    unknown,
    string,
    unknown,
    string
  >[]
> {
  const mcpResponse = await mcpClient.listTools();
  const mcpTools = mcpResponse.tools;

  const langchainTools = mcpTools.map((mcpTool) => {
    return tool(
      async (input: any) => {
        const result = await mcpClient.callTool({
          name: mcpTool.name,
          arguments: input,
        });

        return JSON.stringify(result.content);
      },
      {
        name: mcpTool.name,
        description: mcpTool.description || "",
        schema: mcpTool.inputSchema,
      }
    );
  });

  return langchainTools;
}
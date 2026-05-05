import express from "express";
import { WebSocketServer } from "ws";

import { ENV } from "./config/env-config.js";
import { createMcpClient } from "./infrastructure/output/mcp/mcp-client.js";
import { createLangchainClient } from "./infrastructure/output/langchain/langchain-client.js";
import { getLangchainToolsFromMcp } from "./infrastructure/output/langchain/langchain-tools.js";
import { setupWebSocketHandlers } from "./infrastructure/input/websocket/handlers/websocket-handler.js";

/**
 * Inicializa o cliente MCP e seus dependentes.
 */
async function initializeMcpClient() {
  const mcpClient = await createMcpClient(ENV.QUERY_MCP_SERVER_ENDPOINT);
  const tools = await getLangchainToolsFromMcp(mcpClient);

  return { mcpClient, tools };
}

/**
 * Inicializa o cliente Langchain.
 */
function initializeLangchain() {
  const llm = createLangchainClient(ENV.LLM_API_KEY, ENV.LLM_MODEL, ENV.LLM_BASE_URL);
  return llm;
}

/**
 * Inicia o servidor Express e WebSocket.
 */
async function start() {
  const app = express();
  app.use(express.json());

  const { mcpClient, tools } = await initializeMcpClient();
  const llm = initializeLangchain();

  const server = app.listen(ENV.MCP_CLIENT_PORT, () => {
    console.log(`MCP client running on ${ENV.MCP_CLIENT_WS_ENDPOINT} and port ${ENV.MCP_CLIENT_PORT}`);
  });

  const wss = new WebSocketServer({
    server,
    path: ENV.MCP_CLIENT_WS_ENDPOINT,
  });

  wss.on("connection", (ws) => {
    setupWebSocketHandlers(ws, llm, tools);
  });

  process.on("SIGINT", async () => {
    console.log("Shutting down MCP client...");
    wss.close();
    server.close();
    await mcpClient.close();
    process.exit(0);
  });
}

start().catch((err) => {
  console.error("Error starting MCP client:", err);
  process.exit(1);
});
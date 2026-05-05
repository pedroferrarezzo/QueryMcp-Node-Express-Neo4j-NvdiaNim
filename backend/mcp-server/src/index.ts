import express from "express";
import { registerTools } from "./tools/mcp-tools";
import { ENV } from "./config/env-config";
import { MCPSessionManager } from "./infrastructure/input/http/session/mcp-session-manager";
import { MCPController } from "./infrastructure/input/http/controllers/mcp-controller";
import { createMcpRouter } from "./infrastructure/input/http/routes/mcp-routes";
import { getNodeMailerTransporter } from "./infrastructure/output/email/nodemailer/node-mailer-transport";
import { NodeMailerClient } from "./infrastructure/output/email/nodemailer/node-mailer-client";
import { getNeo4jDriver } from "./infrastructure/output/repository/neo4j/neo4j-driver";
import { Neo4jRepository } from "./infrastructure/output/repository/neo4j/neo4j-repository";

const app = express();
app.use(express.json());

const neo4jRepository = new Neo4jRepository(getNeo4jDriver());
const emailClient = new NodeMailerClient(getNodeMailerTransporter(), ENV.EMAIL_FROM);

const sessionManager = new MCPSessionManager({
    schema: { name: "query-mcp-server", version: "1.0.0" },
    registerToolsFunc: registerTools,
    dbRepository: neo4jRepository,
    emailClient: emailClient,
});

const controller = new MCPController(sessionManager);

app.use("/", createMcpRouter(controller));

app.listen(ENV.MCP_SERVER_PORT, () => {
    console.log(`MCP server running on ${ENV.MCP_SERVER_ENDPOINT} and port ${ENV.MCP_SERVER_PORT}`);
});

process.on("SIGINT", async () => {
    console.log("Shutting down MCP server...");
    await sessionManager.cleanup();
    process.exit(0);
});
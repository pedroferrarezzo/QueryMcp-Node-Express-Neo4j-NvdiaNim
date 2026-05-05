import express from "express";
import { MCPController } from "../controllers/mcp-controller";
import { extractSessionId, requireSessionId } from "../middlewares/mcp-middleware";
import { ENV } from "../../../../config/env-config";

/**
 * Cria router MCP com middlewares aplicados.
 */
export function createMcpRouter(controller: MCPController) {
    const router = express.Router();

    router.post(
        ENV.MCP_SERVER_ENDPOINT,
        extractSessionId,
        (req, res) => controller.post(req, res)
    );

    router.get(
        ENV.MCP_SERVER_ENDPOINT,
        extractSessionId,
        requireSessionId,
        (req, res) => controller.get(req, res)
    );

    return router;
}
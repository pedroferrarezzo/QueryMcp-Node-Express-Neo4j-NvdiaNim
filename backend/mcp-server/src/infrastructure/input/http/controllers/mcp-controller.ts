import { Request, Response } from "express";
import { MCPSessionManager } from "../session/mcp-session-manager";

/**
 * Controller HTTP para endpoints MCP.
 */
export class MCPController {
    constructor(private readonly sessionManager: MCPSessionManager) {}

    /**
     * Handler para POST: cria ou reutiliza sessão.
     */
    async post(req: Request, res: Response): Promise<unknown> {
        const sessionId = (req as any).sessionId;

        if (sessionId) {
            const session = this.sessionManager.getSession(sessionId);

            if (!session?.streamableHttpTransport) {
                return res.status(401).json({ error: "Invalid session" });
            }

            console.debug("Handling POST request for existing session: ", sessionId);

            return session.streamableHttpTransport.handleRequest(req, res, req.body);
        }

        console.debug("Creating new session for request");

        const session = await this.sessionManager.createSession();
        return session.streamableHttpTransport?.handleRequest(req, res, req.body);
    }

    /**
     * Handler para GET (SSE): requer sessão existente.
     */
    async get(req: Request, res: Response): Promise<unknown> {
        const sessionId = (req as any).sessionId;

        const session = this.sessionManager.getSession(sessionId);

        if (!session?.streamableHttpTransport) {
            return res.status(401).json({ error: "Invalid session" });
        }

        console.debug("Handling GET request for existing session: ", sessionId);

        return session.streamableHttpTransport.handleRequest(req, res, req.body);
    }
}
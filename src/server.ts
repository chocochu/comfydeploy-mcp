import type { IncomingHttpHeaders } from "node:http";
import { FastMCP } from "fastmcp";
import { listSharedWorkflows } from "./tools/get-workflows";

export interface SessionData {
	headers: IncomingHttpHeaders;
	[key: string]: unknown;
}

export const server = new FastMCP({
	name: "comfydeploy-mcp",
	version: "1.0.0",
	instructions: "ComfyDeploy MCP Server",
	authenticate: async (req): Promise<SessionData> => {
		return {
			headers: req.headers,
		};
	},
});

server.addTool(listSharedWorkflows);

server.start({
	transportType: "httpStream",
	httpStream: {
		port: 8080,
	},
});

server.on("connect", (event) => {
	console.log("Client connected:", event.session);
});

server.on("disconnect", (event) => {
	console.log("Client disconnected:", event.session);
});

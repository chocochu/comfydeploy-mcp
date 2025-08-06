#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { createCommunityDeploymentsTools } from "./tools/get-deployments.js";
import { uploadFile } from "./tools/upload-file.js";

// Parse command line arguments
function parseArgs(): {
	transport: "stdio" | "httpStream";
	port: number;
} {
	const args = process.argv.slice(2);
	let transport: "stdio" | "httpStream" = "stdio";
	let port: number = 8080;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		switch (arg) {
			case "--transport":
			case "-t": {
				const transportValue = args[i + 1];
				if (transportValue === "http" || transportValue === "httpStream") {
					transport = transportValue === "http" ? "httpStream" : "stdio";
				} else if (transportValue === "stdio") {
					transport = "stdio";
				}
				i++;
				break;
			}
			case "--port":
			case "-p": {
				const portValue = parseInt(args[i + 1] ?? "8080");
				if (!Number.isNaN(portValue)) {
					port = portValue;
				}
				i++;
				break;
			}
		}
	}

	return { transport, port };
}

export const server = new FastMCP({
	name: "comfydeploy-mcp",
	version: "1.0.4",
	instructions: `ComfyDeploy MCP Server - AI Generation Tools

This server provides pre-loaded tools for running AI generation workflows from the ComfyDeploy community.

AVAILABLE TOOLS:
- Each community deployment is available as a tool
- Each tool has specific inputs based on its workflow requirements
- You can upload files to the server using the 'upload-file' tool and get the URL for use in deployments that require file URLs as inputs (e.g., images, videos, documents).

HOW TO USE:
1. Choose the appropriate tool based on what you want to generate
2. Provide the required inputs (each tool has its own input parameters)
3. The tool will execute the deployment and return the generated content
`,
});

// server.addTool(listSharedWorkflows);
// server.addTool(getWorkflow);
// server.addTool(listDeployments);
// server.addTool(listDeploymentsByWorkflow);
// server.addTool(listCommunityDeployments);
// server.addTool(runDeployment);
// server.addTool(runWorkflow);
server.addTool(uploadFile);

// Initialize and start server
async function initializeAndStart() {
	try {
		// Create and register community deployment tools
		console.error("Loading community deployment tools...");
		const communityTools = await createCommunityDeploymentsTools();
		console.error(`Loaded ${communityTools.length} community deployment tools`);

		// Register each community tool
		for (const tool of communityTools) {
			server.addTool(tool);
		}

		console.error("Community deployment tools registered successfully");
	} catch (error) {
		console.error("Failed to load community deployment tools:", error);
		// Continue even if community tools fail to load
	}

	const { transport, port } = parseArgs();

	if (transport === "httpStream") {
		server.start({
			transportType: "httpStream",
			httpStream: {
				port,
			},
		});
	} else {
		server.start({
			transportType: "stdio",
		});
	}

	server.on("connect", (event) => {
		console.error("Client connected:", event.session);
	});

	server.on("disconnect", (event) => {
		console.error("Client disconnected:", event.session);
	});
}

// Start the server
initializeAndStart().catch((error) => {
	console.error("Failed to initialize server:", error);
	process.exit(1);
});

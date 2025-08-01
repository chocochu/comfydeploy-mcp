#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import { listDeployments } from "./tools/get-deployments";
import { listSharedWorkflows } from "./tools/get-workflows";
import { runDeployment } from "./tools/run-deployment";
import { runWorkflow } from "./tools/run-workflow";

// Parse command line arguments
function parseArgs(): {
	transport: "stdio" | "httpStream";
	port: number;
} {
	const args = process.argv.slice(2);
	let transport: "stdio" | "httpStream" = "httpStream";
	let port: number = 8080;

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];
		switch (arg) {
			case "--transport":
			case "-t": {
				const transportValue = args[i + 1];
				if (transportValue === "http" || transportValue === "httpStream") {
					transport = transportValue === "http" ? "httpStream" : "httpStream";
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
	version: "1.0.0",
	instructions: "ComfyDeploy MCP Server",
});

server.addTool(listSharedWorkflows);
server.addTool(listDeployments);
server.addTool(runDeployment);
server.addTool(runWorkflow);

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
	console.log("Client connected:", event.session);
});

server.on("disconnect", (event) => {
	console.log("Client disconnected:", event.session);
});

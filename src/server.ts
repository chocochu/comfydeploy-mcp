#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import {
	// listDeployments,
	listDeploymentsByWorkflow,
} from "./tools/get-deployments.js";
import { listSharedWorkflows } from "./tools/get-workflows.js";
import { runDeployment } from "./tools/run-deployment.js";

// import { uploadFile } from "./tools/upload-file.js";

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
	version: "1.0.0",
	instructions: `ComfyDeploy MCP Server - AI Generation Platform Integration

INTENDED WORKFLOW:
1. DISCOVER: Use 'list-shared-workflows' with MULTIPLE search strategies:
   - Try different keywords (e.g., for thumbnails: "thumbnail", "image generation", "text to image")
   - Search with broader terms first, then specific ones
   - Compare results to find the best-matching workflow for user requirements
2. FIND DEPLOYMENTS: Use 'list-deployments-by-workflow' with the selected workflow_id
3. UPLOAD FILES (Not available yet, will be implemented in the future):
   - PREFERRED: Use 'upload-file-from-resource' with Resource URIs (e.g., 'file:///path/to/image.png')
   - ALTERNATIVE: Use 'upload-file' with direct file paths
4. EXECUTE: Use 'run-deployment' with correct input format, including uploaded file URLs

SEARCH STRATEGY:
- Always try multiple search terms to find the best workflows
- For image generation: try "thumbnail", "image generation", "text to image", "art", "photo"
- For video: try "video", "animation", "motion", "clip"
- For editing: try "edit", "transform", "modify", "enhance"
- Compare results and select the most relevant workflow

INPUT FORMAT FOR RUN-DEPLOYMENT:
- Inputs must be a flat key-value object: {"node_id": "value", "another_node": "value"}
- NOT nested objects like {"node_id": {"inputs": {"text": "value"}}}
- Common node IDs for text prompts: "6" (positive), "7" (negative)
- Check workflow structure to understand required node IDs

WORKFLOW OVERVIEW:
- Workflows are base ComfyUI templates/configurations
- Deployments are production-ready, executable versions of workflows
- Users provide natural language requests → Agent searches workflows → Agent finds deployment → Agent runs deployment with inputs

TOOLS PRIORITY:
- list-shared-workflows (multiple searches) → list-deployments-by-workflow → run-deployment
`,
});

server.addTool(listSharedWorkflows);
// server.addTool(getWorkflow);
// server.addTool(listDeployments);
server.addTool(listDeploymentsByWorkflow);
server.addTool(runDeployment);
// server.addTool(uploadFile);
// server.addTool(runWorkflow);

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

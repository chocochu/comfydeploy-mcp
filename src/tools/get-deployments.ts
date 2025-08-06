import { imageContent } from "fastmcp";
import { z } from "zod";
import {
	// type Deployment,
	DeploymentsResponseSchema,
} from "../schemas/deployment.js";
import { runOutputResponseSchema } from "../schemas/run.js";
import { apiRequest } from "../utils/api.js";

// const listDeploymentsParamsSchema = z.object({
// 	environment: z.enum([
// 		// "production",
// 		// "staging",
// 		"public-share",
// 		"private-share",
// 		"community-share",
// 		// "preview",
// 	]),
// 	// is_fluid: z.boolean().default(false).nullish(),
// 	// page_size: z.int().nullish(),
// 	// offset: z.int().nullish().default(0),
// });

// const listDeploymentsByWorkflowParamsSchema = z.object({
// 	workflow_id: z.uuid(),
// });

// const listCommunityDeploymentsParamsSchema = z.object({
// 	search: z.string().optional(),
// 	limit: z.int().optional().default(20),
// 	offset: z.int().optional().default(0),
// });

// function filterDeployments(deployments: Deployment[]) {
// 	return deployments.map((deployment) => {
// 		// biome-ignore lint/correctness/noUnusedVariables: filter out workflow and version keys from each deployment
// 		const { workflow, version, ...filteredDeployment } = deployment;
// 		return filteredDeployment;
// 	});
// }

// export const listDeployments = {
// 	name: "list-deployments",
// 	description:
// 		"List available AI generation deployments. Deployments are production-ready versions of ComfyUI workflows configured with specific settings, machines, and versions. Use this to find suitable deployments based on user requirements (e.g., image generation, video creation, image editing). Each deployment has a unique deployment_id that can be used with run-deployment. Filter by environment: 'private-share' for deployments created by the user, 'public-share' for shared deployments to the user, 'community-share' for community deployments.",
// 	parameters: listDeploymentsParamsSchema,
// 	annotations: {
// 		title: "List Deployments",
// 		readOnlyHint: true,
// 		openWorldHint: true,
// 	},
// 	execute: async (args: z.infer<typeof listDeploymentsParamsSchema>) => {
// 		const response = await apiRequest("/deployments", "GET", args);
// 		console.error(response);
// 		const parsedData = DeploymentsResponseSchema.parse(response);

// 		// Filter out workflow and version keys from each deployment
// 		const filteredData = parsedData.map((deployment) => {
// 			const { workflow, version, ...filteredDeployment } = deployment;
// 			return filteredDeployment;
// 		});

// 		return JSON.stringify(filteredData);
// 	},
// };

// export const listDeploymentsByWorkflow = {
// 	name: "list-deployments-by-workflow",
// 	description:
// 		"List available AI generation deployments for a specific workflow. This is a more specific version of list-deployments that only returns deployments for a specific workflow. Use this after finding suitable workflows via list-shared-workflows to get the deployments you can actually execute.",
// 	parameters: listDeploymentsByWorkflowParamsSchema,
// 	execute: async (
// 		args: z.infer<typeof listDeploymentsByWorkflowParamsSchema>,
// 	) => {
// 		const response = await apiRequest(
// 			`/workflow/${args.workflow_id}/deployments`,
// 			"GET",
// 		);
// 		console.error(response);
// 		const parsedData = DeploymentsResponseSchema.parse(response);
// 		const filteredData = filterDeployments(parsedData);
// 		return JSON.stringify(filteredData);
// 	},
// };

// export const listCommunityDeployments = {
// 	name: "list-community-deployments",
// 	description:
// 		"List available AI generation deployments for the community. This is a more specific version of list-deployments that only returns deployments for the community. Use this to find suitable deployments based on user requirements (e.g., image generation, video creation, image editing).",
// 	parameters: listCommunityDeploymentsParamsSchema,
// 	execute: async (
// 		args: z.infer<typeof listCommunityDeploymentsParamsSchema>,
// 	) => {
// 		const response = await apiRequest("/deployments/community", "GET", args);
// 		const parsedData = DeploymentsResponseSchema.parse(response);
// 		const filteredData = filterDeployments(parsedData);
// 		return JSON.stringify(filteredData);
// 	},
// };

/**
 * Fetches community deployments and creates MCP tools for each one
 */
export async function createCommunityDeploymentsTools() {
	try {
		// Fetch all community deployments
		const response = await apiRequest("/deployments/community", "GET", {
			limit: 20,
			offset: 0,
		});

		const deployments = DeploymentsResponseSchema.parse(response);
		const tools: any[] = [];

		// Create a tool for each deployment
		for (const deployment of deployments) {
			// Skip deployments without proper metadata
			if (!deployment.id || !deployment.workflow?.name) {
				continue;
			}

			// Create a unique tool name based on deployment ID or slug
			const toolName =
				deployment.share_slug?.replace(/^comfy-deploy_/, "") || deployment.id;

			// Build description from deployment metadata
			const description = [
				deployment.description ||
					`Run the ${deployment.workflow.name} workflow`,
				deployment.workflow.name ? `Workflow: ${deployment.workflow.name}` : "",
			]
				.filter(Boolean)
				.join(". ");

			// Create input schema based on deployment input types
			const inputProperties: Record<string, any> = {};
			const requiredInputs: string[] = [];

			if (deployment.input_types && deployment.input_types.length > 0) {
				for (const input of deployment.input_types) {
					const paramName = input.display_name || input.input_id;
					const paramDescription =
						input.description || `Input for node ${input.input_id}`;

					// Create schema based on input type
					const schema: any = {
						description: paramDescription,
						type: "string", // default type
					};

					// Adjust schema based on input class type
					if (
						input.type === "integer" ||
						input.type === "float" ||
						input.type === "number"
					) {
						schema.type = "number";
						if (input.min_value !== null && input.min_value !== undefined) {
							schema.minimum = input.min_value;
						}
						if (input.max_value !== null && input.max_value !== undefined) {
							schema.maximum = input.max_value;
						}
					} else if (input.type === "boolean") {
						schema.type = "boolean";
					} else if (input.enum_options && input.enum_options.length > 0) {
						schema.enum = input.enum_options;
					}

					// Add default value if available
					if (
						input.default_value !== null &&
						input.default_value !== undefined &&
						typeof input.default_value === input.type
					) {
						schema.default = input.default_value;
					} else {
						// If no default, consider it required
						requiredInputs.push(paramName);
					}

					inputProperties[paramName] = schema;
				}
			}

			// Create the parameters schema
			const parametersSchema = z.object({
				inputs: z
					.object(
						Object.fromEntries(
							Object.entries(inputProperties).map(([key, schema]) => {
								// Convert our schema to zod schema
								let zodSchema: any;
								if (schema.type === "number") {
									zodSchema = z.number();
									if (schema.minimum !== undefined) {
										zodSchema = zodSchema.min(schema.minimum);
									}
									if (schema.maximum !== undefined) {
										zodSchema = zodSchema.max(schema.maximum);
									}
								} else if (schema.type === "boolean") {
									zodSchema = z.boolean();
								} else if (schema.enum) {
									zodSchema = z.enum(schema.enum as [string, ...string[]]);
								} else {
									zodSchema = z.string();
								}

								// Add description
								if (schema.description) {
									zodSchema = zodSchema.describe(schema.description);
								}

								// Make optional if has default
								if (schema.default !== undefined) {
									zodSchema = zodSchema.optional().default(schema.default);
								}

								return [key, zodSchema];
							}),
						),
					)
					.describe("Input parameters for the workflow"),
			});

			// Create the tool
			const tool = {
				name: toolName,
				description,
				parameters: parametersSchema,
				execute: async (args: any) => {
					// Map the friendly input names back to node IDs
					const nodeInputs: Record<string, any> = {};
					if (deployment.input_types && args.inputs) {
						for (const input of deployment.input_types) {
							const friendlyName = input.display_name || input.input_id;
							if (args.inputs[friendlyName] !== undefined) {
								nodeInputs[input.input_id] = args.inputs[friendlyName];
							}
						}
					}

					// Run the deployment
					const body = {
						deployment_id: deployment.id,
						inputs: nodeInputs,
					};

					console.error(body);

					const response = await apiRequest(
						"/run/deployment/sync",
						"POST",
						undefined,
						body,
					);
					console.error(response);
					const parsedData = runOutputResponseSchema.parse(response);
					const run = parsedData[0];
					const content = [];

					// Add summary text
					const imageCount = run?.data.images?.length || 0;
					content.push({
						type: "text",
						text: `Generated ${imageCount} image${imageCount !== 1 ? "s" : ""}`,
					});

					// Add all images to content array
					if (run?.data.images && run?.data.images.length > 0) {
						for (const image of run.data.images) {
							if (image.url) {
								const imageData = await imageContent({
									url: image.url,
								});
								content.push(imageData);
							}
						}
					}

					return { content };
				},
			};

			tools.push(tool);
		}

		return tools;
	} catch (error) {
		console.error("Failed to create community deployment tools:", error);
		return [];
	}
}

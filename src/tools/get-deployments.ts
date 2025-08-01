import { z } from "zod";
import { DeploymentsResponseSchema } from "../schemas/deployment";
import { apiRequest } from "../utils/api";

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

const listDeploymentsByWorkflowParamsSchema = z.object({
	workflow_id: z.uuid(),
});

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

export const listDeploymentsByWorkflow = {
	name: "list-deployments-by-workflow",
	description:
		"List available AI generation deployments for a specific workflow. This is a more specific version of list-deployments that only returns deployments for a specific workflow. Use this after finding suitable workflows via list-shared-workflows to get the deployments you can actually execute.",
	parameters: listDeploymentsByWorkflowParamsSchema,
	execute: async (
		args: z.infer<typeof listDeploymentsByWorkflowParamsSchema>,
	) => {
		const response = await apiRequest(
			`/workflow/${args.workflow_id}/deployments`,
			"GET",
		);
		console.error(response);
		const parsedData = DeploymentsResponseSchema.parse(response);
		const filteredData = parsedData.map((deployment) => {
			const { workflow, version, ...filteredDeployment } = deployment;
			return filteredDeployment;
		});
		return JSON.stringify(filteredData);
	},
};

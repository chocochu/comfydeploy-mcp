import { z } from "zod";
import {
	SharedWorkflowListResponseSchema,
	// SharedWorkflowSchema,
} from "../schemas/shared-workflow.js";
import { apiRequest } from "../utils/api.js";

const listSharedWorkflowsParamsSchema = z.object({
	search: z.string().optional(),
	limit: z.int().optional().default(20),
	offset: z.int().optional().default(0),
	// user_id: z.string().optional(),
});

// const getWorkflowParamsSchema = z.object({
// 	workflow_id: z.uuid(),
// });

export const listSharedWorkflows = {
	name: "list-shared-workflows",
	description:
		"Browse shared workflow templates from the ComfyDeploy community. Workflows are the base ComfyUI configurations before deployment. Use this to discover available workflow types and capabilities, but note that to actually run AI generation, you'll need to use list-deployments to find deployed versions of these workflows. Search by keywords to find specific types of workflows (e.g., 'text-to-image', 'video generation', 'image editing'). IMPORTANT: Use multiple searches with different keywords to find the best matches - try broader terms first, then specific ones. For thumbnails try: 'thumbnail', 'image generation', 'text to image'. Compare results across searches.",
	parameters: listSharedWorkflowsParamsSchema,
	execute: async (args: z.infer<typeof listSharedWorkflowsParamsSchema>) => {
		const response = await apiRequest("/shared-workflows", "GET", args);
		console.error(response);
		const parsedData = SharedWorkflowListResponseSchema.parse(response);
		return JSON.stringify(parsedData);
	},
};

// export const getWorkflow = {
// 	name: "get-workflow",
// 	description:
// 		"Retrieve detailed information about a specific workflow. This includes the workflow's name, description, and other metadata. Use this to understand the capabilities and requirements of a workflow before using it with run-workflow. The workflow_id can be found in the response from list-shared-workflows.",
// 	parameters: getWorkflowParamsSchema,
// 	execute: async (args: z.infer<typeof getWorkflowParamsSchema>) => {
// 		const response = await apiRequest("/shared-workflows", "GET", args);
// 		console.error(response);
// 		const parsedData = SharedWorkflowSchema.parse(response);
// 		return JSON.stringify(parsedData);
// 	},
// };

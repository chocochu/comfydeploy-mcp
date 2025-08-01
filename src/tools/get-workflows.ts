import { z } from "zod";
import { SharedWorkflowListResponseSchema } from "../schemas/shared-workflow";
import { apiRequest } from "../utils/api";

const listSharedWorkflowsParamsSchema = z.object({
	search: z.string().optional(),
	limit: z.int().optional().default(20),
	offset: z.int().optional().default(0),
	user_id: z.string().optional(),
});

export const listSharedWorkflows = {
	name: "list-shared-workflows",
	description: "List shared workflows",
	parameters: listSharedWorkflowsParamsSchema,
	execute: async (args: z.infer<typeof listSharedWorkflowsParamsSchema>) => {
		const response = await apiRequest("/shared-workflows", "GET", args);
		const parsedData = SharedWorkflowListResponseSchema.parse(response);
		return JSON.stringify(parsedData);
	},
};

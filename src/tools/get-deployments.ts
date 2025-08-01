import { z } from "zod";
import { DeploymentsResponseSchema } from "../schemas/deployment";
import { apiRequest } from "../utils/api";

const listDeploymentsParamsSchema = z.object({
	environment: z.enum([
		"production",
		"staging",
		"public-share",
		"private-share",
		"community-share",
		"preview",
	]),
	is_fluid: z.boolean().default(false).nullish(),
	page_size: z.int().nullish(),
	offset: z.int().nullish().default(0),
});

export const listDeployments = {
	name: "list-deployments",
	description: "List deployments",
	parameters: listDeploymentsParamsSchema,
	execute: async (args: z.infer<typeof listDeploymentsParamsSchema>) => {
		const response = await apiRequest("/deployments", "GET", args);
		const parsedData = DeploymentsResponseSchema.parse(response);
		return JSON.stringify(parsedData);
	},
};

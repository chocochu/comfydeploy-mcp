import { z } from "zod";
import { apiRequest } from "../utils/api";

const runDeploymentBodySchema = z.object({
	deployment_id: z.uuid(),
	inputs: z.record(z.string(), z.unknown()).default({}),
});

export const runDeployment = {
	name: "run-deployment",
	description: "Run a deployment",
	parameters: runDeploymentBodySchema,
	execute: async (args: z.infer<typeof runDeploymentBodySchema>) => {
		const { deployment_id, inputs } = args;
		const body = {
			deployment_id,
			inputs,
		};
		const response = await apiRequest(
			"/run/deployment/sync",
			"POST",
			undefined,
			body,
		);
		console.error(response);
		return JSON.stringify(response);
	},
};

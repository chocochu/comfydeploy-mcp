import { z } from "zod";
import { apiRequest } from "../utils/api";

const runDeploymentBodySchema = z.object({
	deployment_id: z.uuid(),
	inputs: z.record(z.string(), z.any()).default({}),
});

export const runDeployment = {
	name: "run-deployment",
	description:
		'Execute a specific AI generation deployment with user-provided inputs. This is the primary tool for generating content (images, videos, etc.) based on user requests. Use the deployment_id from list-deployments and provide the required inputs as a key-value object. The deployment will process the inputs and return generated content. CRITICAL INPUT FORMAT: Use flat key-value pairs like {"6": "positive prompt", "7": "negative prompt"} NOT nested objects. Common node IDs: "6" for positive prompts, "7" for negative prompts. Check deployment workflow structure to identify required node IDs.',
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

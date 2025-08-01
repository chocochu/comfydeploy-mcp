import { z } from "zod";
import { apiRequest } from "../utils/api.js";

const runWorkflowBodySchema = z.object({
	model_id: z.string(),
	workflow_id: z.string(),
	workflow_version_id: z.string(),
	gpu: z.enum([
		"CPU",
		"T4",
		"L4",
		"A10G",
		"L40G",
		"A100",
		"A100-80GB",
		"H100",
		"H200",
		"B200",
	]),
	inputs: z.record(z.any(), z.any()),
	origin: z.string(),
	batch_number: z.string(),
});

export const runWorkflow = {
	name: "run-workflow",
	description:
		"Run a workflow directly (advanced usage). This tool requires detailed technical configuration including model_id, workflow_id, workflow_version_id, GPU type, and complex input parameters. Most users should use run-deployment instead, which provides a simpler interface for the same functionality. Only use this tool when you need fine-grained control over workflow execution or when specifically requested by advanced users.",
	parameters: runWorkflowBodySchema,
	execute: async (args: z.infer<typeof runWorkflowBodySchema>) => {
		const {
			model_id,
			workflow_id,
			workflow_version_id,
			inputs,
			origin,
			batch_number,
		} = args;
		const body = {
			model_id,
			workflow_id,
			workflow_version_id,
			inputs,
			origin,
			batch_number,
		};
		const response = await apiRequest(
			"/run/workflow/sync",
			"POST",
			undefined,
			body,
		);
		console.error(response);
		return JSON.stringify(response);
	},
};

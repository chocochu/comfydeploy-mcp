import { z } from "zod/v4";
import { outputDataSchema } from "./shared";

// Schema for workflow inputs
export const workflowInputsSchema = z.record(z.string(), z.unknown(), {
  error:
    "Invalid workflow inputs. Please provide a valid object with string keys.",
});

// Schema for workflow API structure
export const workflowApiSchema = z.record(z.string(), z.unknown(), {
  error:
    "Invalid workflow API structure. Please provide a valid object with string keys.",
});

// Schema for RunOutput (from detailed run response)
export const runOutputSchema = z.object({
  id: z.uuid({
    error: "Invalid output ID format. Please provide a valid UUID.",
  }),
  output_id: z.nullish(
    z.string({
      error: "Invalid output ID. Please provide a valid string.",
    }),
  ),
  run_id: z.uuid({
    error: "Invalid run ID format. Please provide a valid UUID.",
  }),
  data: outputDataSchema,
  node_meta: z.object({
    node_id: z.nullish(
      z.string({
        error: "Invalid node ID. Please provide a valid string.",
      }),
    ),
  }),
  created_at: z.coerce.date({
    error: "Invalid creation date. Please provide a valid date.",
  }),
  updated_at: z.coerce.date({
    error: "Invalid update date. Please provide a valid date.",
  }),
  type: z.nullish(
    z.string({
      error: "Invalid output type. Please provide a valid string.",
    }),
  ),
  node_id: z.nullish(
    z.string({
      error: "Invalid node ID. Please provide a valid string.",
    }),
  ),
});

// Simple Run schema (for runs list by deploymentId)
export const runListItemSchema = z.object({
  id: z.uuid({
    error: "Invalid run ID format. Please provide a valid UUID.",
  }),
  workflow_version_id: z.nullish(
    z.uuid({
      error: "Invalid workflow version ID format. Please provide a valid UUID.",
    }),
  ),
  deployment_id: z.uuid({
    error: "Invalid deployment ID format. Please provide a valid UUID.",
  }),
  workflow_id: z.uuid({
    error: "Invalid workflow ID format. Please provide a valid UUID.",
  }),
  machine_id: z.nullish(
    z.uuid({
      error: "Invalid machine ID format. Please provide a valid UUID.",
    }),
  ),
  origin: z.string({
    error: "Invalid origin. Please provide a valid string.",
  }),
  status: z.string({
    error: "Invalid run status. Please provide a valid string.",
  }),
  ended_at: z.nullish(
    z.coerce.date({
      error: "Invalid end date. Please provide a valid date.",
    }),
  ),
  created_at: z.coerce.date({
    error: "Invalid creation date. Please provide a valid date.",
  }),
  started_at: z.nullish(
    z.coerce.date({
      error: "Invalid start date. Please provide a valid date.",
    }),
  ),
  gpu: z.nullish(
    z.string({
      error: "Invalid GPU specification. Please provide a valid string.",
    }),
  ),
  user_id: z.nullish(
    z.string({
      error: "Invalid user ID. Please provide a valid string.",
    }),
  ),
  duration: z.nullish(
    z.coerce.number({
      error: "Invalid duration. Please provide a valid number.",
    }),
  ),
});

// Detailed Run schema (for single run by runId)
export const runDetailSchema = z.object({
  id: z.uuid({
    error: "Invalid run ID format. Please provide a valid UUID.",
  }),
  workflow_version_id: z.nullish(
    z.uuid({
      error: "Invalid workflow version ID format. Please provide a valid UUID.",
    }),
  ),
  workflow_inputs: workflowInputsSchema.optional(),
  workflow_id: z.uuid({
    error: "Invalid workflow ID format. Please provide a valid UUID.",
  }),
  workflow_api: workflowApiSchema.optional(),
  machine_id: z.nullish(
    z.uuid({
      error: "Invalid machine ID format. Please provide a valid UUID.",
    }),
  ),
  origin: z.string({
    error: "Invalid origin. Please provide a valid string.",
  }),
  status: z.string({
    error: "Invalid run status. Please provide a valid string.",
  }),
  ended_at: z.nullish(
    z.coerce.date({
      error: "Invalid end date. Please provide a valid date.",
    }),
  ),
  created_at: z.coerce.date({
    error: "Invalid creation date. Please provide a valid date.",
  }),
  updated_at: z.coerce.date({
    error: "Invalid update date. Please provide a valid date.",
  }),
  queued_at: z.nullish(
    z.coerce.date({
      error: "Invalid queue date. Please provide a valid date.",
    }),
  ),
  started_at: z.nullish(
    z.coerce.date({
      error: "Invalid start date. Please provide a valid date.",
    }),
  ),
  gpu_event_id: z.nullish(
    z.string({
      error: "Invalid GPU event ID. Please provide a valid string.",
    }),
  ),
  gpu: z.nullish(
    z.string({
      error: "Invalid GPU specification. Please provide a valid string.",
    }),
  ),
  machine_version: z.nullish(
    z.string({
      error: "Invalid machine version. Please provide a valid string.",
    }),
  ),
  machine_type: z.nullish(
    z.string({
      error: "Invalid machine type. Please provide a valid string.",
    }),
  ),
  modal_function_call_id: z.nullish(
    z.string({
      error: "Invalid modal function call ID. Please provide a valid string.",
    }),
  ),
  user_id: z.nullish(
    z.string({
      error: "Invalid user ID. Please provide a valid string.",
    }),
  ),
  org_id: z.nullish(
    z.string({
      error: "Invalid organization ID. Please provide a valid string.",
    }),
  ),
  live_status: z.nullish(
    z.string({
      error: "Invalid live status. Please provide a valid string.",
    }),
  ),
  progress: z.nullish(
    z.number({
      error: "Invalid progress value. Please provide a valid number.",
    }),
  ),
  is_realtime: z.nullish(
    z.boolean({
      error: "Invalid realtime flag. Please provide true or false.",
    }),
  ),
  webhook: z.nullish(
    z.string({
      error: "Invalid webhook URL. Please provide a valid string.",
    }),
  ),
  webhook_status: z.nullish(
    z.string({
      error: "Invalid webhook status. Please provide a valid string.",
    }),
  ),
  webhook_intermediate_status: z.nullish(
    z.boolean({
      error:
        "Invalid webhook intermediate status. Please provide true or false.",
    }),
  ),
  outputs: z
    .array(runOutputSchema, {
      error: "Invalid outputs. Please provide a valid array of run outputs.",
    })
    .optional(),
  number: z.nullish(
    z.number({
      error: "Invalid run number. Please provide a valid number.",
    }),
  ),
  duration: z.nullish(
    z.number({
      error: "Invalid duration. Please provide a valid number.",
    }),
  ),
  cold_start_duration: z.nullish(
    z.number({
      error: "Invalid cold start duration. Please provide a valid number.",
    }),
  ),
  cold_start_duration_total: z.nullish(
    z.number({
      error:
        "Invalid total cold start duration. Please provide a valid number.",
    }),
  ),
  run_duration: z.nullish(
    z.number({
      error: "Invalid run duration. Please provide a valid number.",
    }),
  ),
  queue_position: z.nullish(
    z.number({
      error: "Invalid queue position. Please provide a valid number.",
    }),
  ),
});

// Schema for array of workflow runs (from deploymentId endpoint)
export const runsResponseSchema = z.object({
  data: z.array(runListItemSchema, {
    error: "Invalid runs data. Please provide a valid array of run items.",
  }),
});

// Exported types
export type WorkflowInputs = z.infer<typeof workflowInputsSchema>;
export type WorkflowApi = z.infer<typeof workflowApiSchema>;
export type RunOutput = z.infer<typeof runOutputSchema>;
export type RunListItem = z.infer<typeof runListItemSchema>;
export type RunDetail = z.infer<typeof runDetailSchema>;
export type RunsResponse = z.infer<typeof runsResponseSchema>;

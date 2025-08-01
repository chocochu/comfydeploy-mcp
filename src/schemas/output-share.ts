import { z } from "zod/v4";
import { outputDataSchema } from "./shared";

export const outputShareItemSchema = z.object({
  id: z.uuid({
    error: "Invalid share ID format. Please provide a valid UUID.",
  }),
  user_id: z.string({
    error: "Invalid user ID. Please provide a valid string.",
  }),
  org_id: z
    .string({
      error: "Invalid organization ID. Please provide a valid string.",
    })
    .nullish(),
  run_id: z.uuid({
    error: "Invalid run ID format. Please provide a valid UUID.",
  }),
  output_id: z.uuid({
    error: "Invalid output ID format. Please provide a valid UUID.",
  }),
  deployment_id: z
    .uuid({
      error: "Invalid deployment ID format. Please provide a valid UUID.",
    })
    .nullish(),
  output_data: outputDataSchema,
  output_type: z.string({
    error: "Invalid output type. Please provide a valid string.",
  }),
  visibility: z.string({
    error: "Invalid visibility setting. Please provide a valid string.",
  }),
  created_at: z.coerce.date({
    error: "Invalid creation date. Please provide a valid date.",
  }),
  updated_at: z.coerce.date({
    error: "Invalid update date. Please provide a valid date.",
  }),
  inputs: z
    .record(z.string(), z.unknown(), {
      error: "Invalid inputs. Please provide a valid object.",
    })
    .nullable(),
});

// Add new schema for run info
export const runInfoSchema = z.object({
  id: z.uuid({
    error: "Invalid run ID format. Please provide a valid UUID.",
  }),
  status: z.string({
    error: "Invalid run status. Please provide a valid string.",
  }),
  created_at: z.coerce.date({
    error: "Invalid creation date. Please provide a valid date.",
  }),
});

// Add new schema for single output share response
export const singleOutputShareResponseSchema = z.object({
  share: outputShareItemSchema,
  run: runInfoSchema,
});

export const outputShareResponseSchema = z.array(outputShareItemSchema, {
  error:
    "Invalid output share response. Please provide a valid array of output shares.",
});

// Schema for creating output share request
export const createOutputShareRequestSchema = z.object({
  run_id: z.uuid({
    error: "Invalid run ID format. Please provide a valid UUID.",
  }),
  output_id: z.uuid({
    error: "Invalid output ID format. Please provide a valid UUID.",
  }),
  deployment_id: z
    .uuid({
      error: "Invalid deployment ID format. Please provide a valid UUID.",
    })
    .nullish(),
  output_type: z
    .string({
      error: "Output type must be a valid string.",
    })
    .default("other")
    .nullish(),
  visibility: z
    .enum(["private", "link-only", "public"], {
      error: "Visibility must be one of: private, link-only, or public.",
    })
    .nullish()
    .default("private"),
});

// Schema for create output share response
export const createOutputShareResponseSchema = z.object({
  id: z.uuid({
    error: "Invalid share ID format. Please provide a valid UUID.",
  }),
  user_id: z.string({
    error: "Invalid user ID. Please provide a valid string.",
  }),
  org_id: z.string({
    error: "Invalid organization ID. Please provide a valid string.",
  }),
  run_id: z.uuid({
    error: "Invalid run ID format. Please provide a valid UUID.",
  }),
  output_id: z.uuid({
    error: "Invalid output ID format. Please provide a valid UUID.",
  }),
  deployment_id: z
    .uuid({
      error: "Invalid deployment ID format. Please provide a valid UUID.",
    })
    .nullish(),
  output_data: outputDataSchema,
  output_type: z.string({
    error: "Invalid output type. Please provide a valid string.",
  }),
  visibility: z.string({
    error: "Invalid visibility setting. Please provide a valid string.",
  }),
  created_at: z.coerce.date({
    error: "Invalid creation date. Please provide a valid date.",
  }),
  updated_at: z.coerce.date({
    error: "Invalid update date. Please provide a valid date.",
  }),
  inputs: z
    .record(z.string(), z.unknown(), {
      error: "Invalid inputs. Please provide a valid object.",
    })
    .nullable(),
});

export type OutputData = z.infer<typeof outputDataSchema>;
export type OutputShareItem = z.infer<typeof outputShareItemSchema>;
export type RunInfo = z.infer<typeof runInfoSchema>;
export type SingleOutputShareResponse = z.infer<
  typeof singleOutputShareResponseSchema
>;
export type OutputShareResponse = z.infer<typeof outputShareResponseSchema>;
export type CreateOutputShareRequest = z.infer<
  typeof createOutputShareRequestSchema
>;
export type CreateOutputShareResponse = z.infer<
  typeof createOutputShareResponseSchema
>;

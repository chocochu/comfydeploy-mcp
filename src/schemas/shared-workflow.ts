import { z } from "zod/v4";

// Docker command step schema - simplified to accept anything
export const DockerCommandStepSchema = z.any().nullish();

// Workflow environment schema - simplified to accept anything
export const WorkflowEnvironmentSchema = z.any().nullish();

// Workflow export schema
export const WorkflowExportSchema = z.looseObject({
  id: z
    .string({
      error: "Invalid workflow export ID. Please provide a valid string.",
    })
    .optional(),
  workflow_api: z.any().optional(),
  nodes: z
    .array(z.any(), {
      error: "Invalid nodes. Please provide a valid array of nodes.",
    })
    .optional(),
  links: z
    .array(z.any(), {
      error: "Invalid links. Please provide a valid array of links.",
    })
    .optional(),
  groups: z
    .array(z.any(), {
      error: "Invalid groups. Please provide a valid array of groups.",
    })
    .optional(),
  version: z
    .union([z.string(), z.number()], {
      error: "Invalid version. Please provide a valid string or number.",
    })
    .optional(),
  revision: z
    .number({
      error: "Invalid revision. Please provide a valid number.",
    })
    .optional(),
  last_link_id: z
    .number({
      error: "Invalid last_link_id. Please provide a valid number.",
    })
    .optional(),
  last_node_id: z
    .number({
      error: "Invalid last_node_id. Please provide a valid number.",
    })
    .optional(),
  config: z
    .record(z.string(), z.any(), {
      error: "Invalid config data. Please provide a valid object.",
    })
    .optional(),
  extra: z
    .record(z.string(), z.any(), {
      error: "Invalid extra data. Please provide a valid object.",
    })
    .optional(),
  environment: WorkflowEnvironmentSchema.optional(),
});

// Main shared workflow schema
export const SharedWorkflowSchema = z.looseObject({
  id: z.string({
    error: "Invalid workflow ID. Please provide a valid string.",
  }),
  user_id: z.string({
    error: "Invalid user ID. Please provide a valid string.",
  }),
  org_id: z
    .string({
      error: "Invalid organization ID. Please provide a valid string.",
    })
    .optional()
    .nullable(),
  workflow_id: z.string({
    error: "Invalid workflow ID. Please provide a valid string.",
  }),
  workflow_version_id: z
    .string({
      error: "Invalid workflow version ID. Please provide a valid string.",
    })
    .optional()
    .nullable(),
  workflow_export: WorkflowExportSchema.optional().nullable(),
  share_slug: z.string({
    error: "Invalid share slug. Please provide a valid string.",
  }),
  title: z.string({
    error: "Invalid title. Please provide a valid string.",
  }),
  description: z.string({
    error: "Invalid description. Please provide a valid string.",
  }),
  cover_image: z.string({
    error: "Invalid cover image URL. Please provide a valid string.",
  }),
  is_public: z.boolean({
    error: "Invalid public flag. Please provide a valid boolean.",
  }),
  view_count: z
    .number({
      error: "Invalid view count. Please provide a valid number.",
    })
    .int()
    .min(0, {
      error: "View count must be a non-negative integer.",
    }),
  download_count: z
    .number({
      error: "Invalid download count. Please provide a valid number.",
    })
    .int()
    .min(0, {
      error: "Download count must be a non-negative integer.",
    }),
  created_at: z.coerce.date({
    error:
      "Invalid creation date format. Please provide a valid ISO datetime string.",
  }),
  updated_at: z.coerce.date({
    error:
      "Invalid update date format. Please provide a valid ISO datetime string.",
  }),
});

// Shared workflow list response schema
export const SharedWorkflowListResponseSchema = z.looseObject({
  shared_workflows: z.array(SharedWorkflowSchema, {
    error:
      "Invalid shared workflows. Please provide a valid array of shared workflows.",
  }),
  total: z
    .number({
      error: "Invalid total count. Please provide a valid number.",
    })
    .int()
    .min(0, {
      error: "Total count must be a non-negative integer.",
    }),
});

// Array of shared workflows (for direct array responses)
export const SharedWorkflowsArraySchema = z.array(SharedWorkflowSchema, {
  error:
    "Invalid shared workflows array. Please provide a valid array of shared workflows.",
});

// Type exports
export type WorkflowEnvironment = z.infer<typeof WorkflowEnvironmentSchema>;
export type WorkflowExport = z.infer<typeof WorkflowExportSchema>;
export type SharedWorkflow = z.infer<typeof SharedWorkflowSchema>;
export type SharedWorkflowListResponse = z.infer<
  typeof SharedWorkflowListResponseSchema
>;
export type SharedWorkflowsArray = z.infer<typeof SharedWorkflowsArraySchema>;
export type DockerCommandStep = z.infer<typeof DockerCommandStepSchema>;

import { z } from "zod/v4";

// Environment enum
export const DeploymentEnvironmentSchema = z.enum(
  [
    "staging",
    "production",
    "public-share",
    "private-share",
    "preview",
    "community-share",
  ],
  {
    error:
      "Invalid environment. Must be one of: staging, production, public-share, private-share, preview, community-share.",
  },
);

// Workflow schema
export const WorkflowSchema = z
  .object({
    id: z.uuid({
      error: "Invalid workflow ID format. Please provide a valid UUID.",
    }),
    name: z.string({
      error: "Invalid workflow name. Please provide a valid string.",
    }),
    cover_url: z
      .string({
        error: "Invalid cover URL. Please provide a valid string.",
      })
      .nullish(),
  })
  .nullish();

// Machine schema
export const MachineSchema = z
  .object({
    id: z.uuid({
      error: "Invalid machine ID format. Please provide a valid UUID.",
    }),
    name: z.string({
      error: "Invalid machine name. Please provide a valid string.",
    }),
  })
  .nullish();

// Input types schema
export const InputModelSchema = z.object({
  type: z.string({
    error: "Invalid input type. Please provide a valid string.",
  }),
  class_type: z.string({
    error: "Invalid class type. Please provide a valid string.",
  }),
  input_id: z.string({
    error: "Invalid input ID. Please provide a valid string.",
  }),
  default_value: z
    .union([z.string(), z.number(), z.boolean(), z.array(z.any()), z.null()], {
      error:
        "Invalid default value. Must be a string, number, boolean, array, or null.",
    })
    .optional(),
  min_value: z
    .number({
      error: "Invalid minimum value. Please provide a valid number.",
    })
    .nullish()
    .optional(),
  max_value: z
    .number({
      error: "Invalid maximum value. Please provide a valid number.",
    })
    .nullish()
    .optional(),
  display_name: z
    .string({
      error: "Invalid display name. Please provide a valid string.",
    })
    .default(""),
  description: z
    .string({
      error: "Invalid description. Please provide a valid string.",
    })
    .default(""),
  options: z
    .string({
      error: "Invalid options. Please provide a valid JSON string.",
    })
    .refine(
      (val) => {
        try {
          const parsed = JSON.parse(val);
          return (
            Array.isArray(parsed) &&
            parsed.every((item) => typeof item === "string")
          );
        } catch {
          return false;
        }
      },
      {
        message:
          "Options must be a valid JSON string containing an array of strings.",
      },
    )
    .nullish()
    .optional(),
  enum_options: z
    .array(
      z.string({
        error: "Invalid enum option. Each option must be a valid string.",
      }),
      {
        error: "Invalid enum options. Please provide a valid array of strings.",
      },
    )
    .nullish()
    .optional(),
  step: z
    .number({
      error: "Invalid step value. Please provide a valid number.",
    })
    .nullish()
    .optional(),
});

// Output types schema
export const OutputModelSchema = z.object({
  class_type: z.string({
    error: "Invalid class type. Please provide a valid string.",
  }),
  output_id: z.string({
    error: "Invalid output ID. Please provide a valid string.",
  }),
});

// Main deployment schema
export const DeploymentSchema = z.object({
  id: z.uuid({
    error: "Invalid deployment ID format. Please provide a valid UUID.",
  }),
  user_id: z.string({
    error: "Invalid user ID. Please provide a valid string.",
  }),
  org_id: z
    .string({
      error: "Invalid organization ID. Please provide a valid string.",
    })
    .nullish(),
  workflow_version_id: z
    .uuid({
      error: "Invalid workflow version ID format. Please provide a valid UUID.",
    })
    .nullish(),
  workflow_id: z
    .uuid({
      error: "Invalid workflow ID format. Please provide a valid UUID.",
    })
    .nullish(),
  machine_id: z
    .uuid({
      error: "Invalid machine ID format. Please provide a valid UUID.",
    })
    .nullish(),
  share_slug: z
    .string({
      error: "Invalid share slug. Please provide a valid string.",
    })
    .nullish(),
  description: z
    .string({
      error: "Invalid description. Please provide a valid string.",
    })
    .nullish(),
  share_options: z
    .record(z.string(), z.unknown(), {
      error: "Invalid share options. Please provide a valid object.",
    })
    .nullish(),
  showcase_media: z
    .array(z.record(z.string(), z.unknown()), {
      error: "Invalid showcase media. Please provide a valid array of objects.",
    })
    .nullish(),
  environment: DeploymentEnvironmentSchema,
  created_at: z.coerce
    .date({
      error: "Invalid creation date. Please provide a valid date.",
    })
    .nullish(),
  updated_at: z.coerce
    .date({
      error: "Invalid update date. Please provide a valid date.",
    })
    .nullish(),
  workflow: WorkflowSchema,
  version: z
    .record(z.string(), z.unknown(), {
      error: "Invalid version. Please provide a valid object.",
    })
    .nullish(),
  machine: MachineSchema,
  input_types: z
    .array(InputModelSchema, {
      error:
        "Invalid input types. Please provide a valid array of input models.",
    })
    .nullish(),
  output_types: z
    .array(OutputModelSchema, {
      error:
        "Invalid output types. Please provide a valid array of output models.",
    })
    .nullish(),
  dub_link: z
    .string({
      error: "Invalid dub link. Please provide a valid string.",
    })
    .nullish(),
  gpu: z
    .string({
      error: "Invalid GPU specification. Please provide a valid string.",
    })
    .nullish(),
  machine_version_id: z
    .uuid({
      error: "Invalid machine version ID format. Please provide a valid UUID.",
    })
    .nullish(),
  modal_image_id: z
    .string({
      error: "Invalid modal image ID. Please provide a valid string.",
    })
    .nullish(),
  concurrency_limit: z
    .number({
      error: "Invalid concurrency limit. Please provide a valid integer.",
    })
    .int()
    .nullish(),
  run_timeout: z
    .number({
      error: "Invalid run timeout. Please provide a valid integer.",
    })
    .int()
    .nullish(),
  idle_timeout: z
    .number({
      error: "Invalid idle timeout. Please provide a valid integer.",
    })
    .int()
    .nullish(),
  keep_warm: z
    .number({
      error: "Invalid keep warm setting. Please provide a valid integer.",
    })
    .int()
    .nullish(),
  activated_at: z.coerce
    .date({
      error: "Invalid activation date. Please provide a valid date or null.",
    })
    .nullish(),
  modal_app_id: z
    .string({
      error: "Invalid modal app ID. Please provide a valid string.",
    })
    .nullish(),
});

// Array of deployments (API response)
export const DeploymentsResponseSchema = z.array(DeploymentSchema, {
  error:
    "Invalid deployments response. Please provide a valid array of deployments.",
});

// Type exports
export type Deployment = z.infer<typeof DeploymentSchema>;
export type DeploymentEnvironment = z.infer<typeof DeploymentEnvironmentSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type Machine = z.infer<typeof MachineSchema>;
export type InputModel = z.infer<typeof InputModelSchema>;
export type OutputModel = z.infer<typeof OutputModelSchema>;
export type DeploymentsResponse = z.infer<typeof DeploymentsResponseSchema>;

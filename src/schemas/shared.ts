import { z } from "zod/v4";

// Schema for MediaItem within workflow run outputs
export const mediaItemSchema = z.object({
  url: z.string(),
  type: z.string(),
  filename: z.string(),
  is_public: z.nullish(z.boolean()),
  subfolder: z.nullish(z.string()),
  upload_duration: z.nullish(z.number()),
});

// Schema for output data structure
export const outputDataSchema = z.object({
  images: z.array(mediaItemSchema).optional(),
  files: z.array(mediaItemSchema).optional(),
  gifs: z.array(mediaItemSchema).optional(),
  text: z.array(z.string()).optional(),
  videos: z.array(mediaItemSchema).optional(),
  model_files: z.array(mediaItemSchema).optional(),
});

// Validation error schema for 422 responses
export const ValidationErrorSchema = z.object({
  loc: z.array(z.union([z.string(), z.number()])),
  msg: z.string(),
  type: z.string(),
});

export const HTTPValidationErrorSchema = z.object({
  detail: z.array(ValidationErrorSchema),
});

// Common API error schemas
export const NotFoundErrorSchema = z.object({
  error: z
    .string()
    .default(
      "Output not found. Please verify the output exists and you have access to it.",
    ),
  status: z.literal(404),
});

export const UnauthorizedErrorSchema = z.object({
  error: z.string().default("You don't have permission to share this output."),
  status: z.literal(401),
});

export const ForbiddenErrorSchema = z.object({
  error: z.string().default("Sharing this output is not allowed."),
  status: z.literal(403),
});

export const ConflictErrorSchema = z.object({
  error: z.string().default("This output has already been shared."),
  status: z.literal(409),
});

export const NetworkErrorSchema = z.object({
  error: z
    .string()
    .default("Network error. Please check your connection and try again."),
  type: z.literal("network"),
});

export const APIErrorSchema = z.union([
  NotFoundErrorSchema,
  UnauthorizedErrorSchema,
  ForbiddenErrorSchema,
  ConflictErrorSchema,
  HTTPValidationErrorSchema,
  NetworkErrorSchema,
]);

export const parseAPIError = (response: unknown) => {
  const apiErrorResult = APIErrorSchema.safeParse(response);
  if (apiErrorResult.success) {
    throw apiErrorResult.data;
  }
  return response;
};

export type MediaItem = z.infer<typeof mediaItemSchema>;
export type OutputData = z.infer<typeof outputDataSchema>;
export type APIError = z.infer<typeof APIErrorSchema>;

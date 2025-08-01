import { z } from "zod/v4";

export const ShareDataSchema = z.object({
  id: z.uuid(),
  user_id: z.string(),
  org_id: z.string().nullable(),
  share_slug: z.string(),
  description: z.string().nullable(),
  workflow: z.record(z.string(), z.unknown()).nullable(),
  input_types: z.array(z.record(z.string(), z.unknown())).nullable(),
  output_types: z.array(z.record(z.string(), z.unknown())).nullable(),
});

export type ShareData = z.infer<typeof ShareDataSchema>;

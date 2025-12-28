import { z } from "zod";

export const prUrlSchema = z
  .string()
  .min(1, "PR URL is required")
  .url("Invalid URL format")
  .regex(
    /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/,
    "Invalid GitHub PR URL. Expected format: https://github.com/owner/repo/pull/123"
  );

export type PrUrlInput = z.infer<typeof prUrlSchema>;

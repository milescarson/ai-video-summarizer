import { z } from "zod";

export const videoUrlSchema = z
  .string()
  .min(1, "Video URL is required")
  .url("Invalid URL format")
  .regex(
    /^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
    "Invalid YouTube video URL. Expected format: https://www.youtube.com/watch?v=... or https://youtu.be/..."
  );

export type VideoUrlInput = z.infer<typeof videoUrlSchema>;

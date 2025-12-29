import { z } from 'zod';

export const videoSummaryRequestSchema = z.object({
  videoUrl: z
    .string()
    .url('Invalid URL format')
    .regex(
      /^https:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/,
      'Invalid YouTube video URL format. Expected: https://www.youtube.com/watch?v=... or https://youtu.be/...'
    ),
});

export const videoSummaryResponseSchema = z.object({
  summary: z.string(),
  main_points: z.array(z.string()),
  key_insights: z.array(z.string()),
  actionable_takeaways: z.array(z.string()),
  notable_timestamps: z.array(z.string()),
});

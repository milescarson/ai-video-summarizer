import { z } from 'zod';

export const prReviewRequestSchema = z.object({
  prUrl: z
    .string()
    .url('Invalid URL format')
    .regex(
      /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+$/,
      'Invalid GitHub PR URL format. Expected: https://github.com/owner/repo/pull/123'
    ),
});

export const prReviewResponseSchema = z.object({
  summary: z.string(),
  high_risk_issues: z.array(z.string()),
  medium_risk_issues: z.array(z.string()),
  low_risk_or_style_issues: z.array(z.string()),
  suggestions: z.array(z.string()),
  questions_for_author: z.array(z.string()),
});

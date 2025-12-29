import type { VideoSummaryResponse } from '../../types';

export interface LlmProvider {
  summarizeTranscript(transcript: string, videoTitle?: string): Promise<VideoSummaryResponse>;
  getName(): string;
}

export const SYSTEM_PROMPT = `You are an expert content analyst specializing in video summarization.

Rules:
- Base your analysis strictly on the provided transcript.
- Do NOT invent or assume information not present in the transcript.
- Be concise, informative, and practical.
- Extract key themes, insights, and actionable takeaways.
- If timestamps are relevant, include them in notable_timestamps.
- Focus on what matters: main ideas, learning opportunities, and practical applications.

Return your response ONLY as valid JSON matching this structure:
{
  "summary": "Brief overview of the video content",
  "main_points": ["Point 1", "Point 2", "Point 3"],
  "key_insights": ["Insight 1", "Insight 2"],
  "actionable_takeaways": ["Takeaway 1", "Takeaway 2"],
  "notable_timestamps": ["HH:MM:SS - Description"]
}`;

export function createUserPrompt(transcript: string, videoTitle?: string): string {
  const titleSection = videoTitle ? `Video Title: ${videoTitle}\n\n` : '';

  return `Analyze the following video transcript and provide a structured summary.

${titleSection}Transcript:
${transcript}

Return your response in the following JSON structure:
{
  "summary": string,
  "main_points": string[],
  "key_insights": string[],
  "actionable_takeaways": string[],
  "notable_timestamps": string[]
}`;
}

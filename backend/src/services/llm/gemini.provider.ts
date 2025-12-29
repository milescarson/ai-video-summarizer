import { GoogleGenerativeAI } from '@google/generative-ai';
import { LlmProvider, SYSTEM_PROMPT, createUserPrompt } from './base';
import type { VideoSummaryResponse } from '../../types';
import { logger } from '../../utils';

export class GeminiProvider implements LlmProvider {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gemini-2.5-flash') {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  getName(): string {
    return 'Gemini';
  }

  async summarizeTranscript(
    transcript: string,
    videoTitle?: string
  ): Promise<VideoSummaryResponse> {
    try {
      logger.info(`Sending transcript to Gemini (${this.model}) for summarization`);

      const model = this.client.getGenerativeModel({
        model: this.model,
        generationConfig: {
          temperature: 0.3,
          responseMimeType: 'application/json',
        },
      });

      const prompt = `${SYSTEM_PROMPT}\n\n${createUserPrompt(transcript, videoTitle)}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const content = response.text();

      if (!content) {
        throw new Error('No response from Gemini');
      }

      const parsed = JSON.parse(content) as VideoSummaryResponse;

      logger.info('Successfully received and parsed Gemini summary');

      return this.normalizeResponse(parsed);
    } catch (error) {
      logger.error('Failed to get Gemini summary', error);

      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message: string }).message;
        if (message.includes('quota')) {
          throw new Error('Gemini API quota exceeded. Please try again later.');
        }
        if (message.includes('API key')) {
          throw new Error('Invalid Gemini API key configuration.');
        }
      }

      throw new Error('Failed to generate summary using Gemini');
    }
  }

  private normalizeResponse(parsed: VideoSummaryResponse): VideoSummaryResponse {
    return {
      summary: parsed.summary || '',
      main_points: parsed.main_points || [],
      key_insights: parsed.key_insights || [],
      actionable_takeaways: parsed.actionable_takeaways || [],
      notable_timestamps: parsed.notable_timestamps || [],
    };
  }
}

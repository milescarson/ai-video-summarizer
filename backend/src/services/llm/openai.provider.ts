import OpenAI from 'openai';
import { LlmProvider, SYSTEM_PROMPT, createUserPrompt } from './base';
import type { VideoSummaryResponse } from '../../types';
import { logger } from '../../utils';

export class OpenAiProvider implements LlmProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = 'gpt-4-turbo-preview') {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  getName(): string {
    return 'OpenAI';
  }

  async summarizeTranscript(
    transcript: string,
    videoTitle?: string
  ): Promise<VideoSummaryResponse> {
    try {
      logger.info(`Sending transcript to OpenAI (${this.model}) for summarization`);

      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: createUserPrompt(transcript, videoTitle) },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      const content = completion.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(content) as VideoSummaryResponse;

      logger.info('Successfully received and parsed OpenAI summary');

      return this.normalizeResponse(parsed);
    } catch (error) {
      logger.error('Failed to get OpenAI summary', error);

      if (error && typeof error === 'object' && 'message' in error) {
        const message = (error as { message: string }).message;
        if (message.includes('rate_limit')) {
          throw new Error('OpenAI API rate limit exceeded. Please try again later.');
        }
        if (message.includes('invalid_api_key')) {
          throw new Error('Invalid OpenAI API key configuration.');
        }
      }

      throw new Error('Failed to generate summary using OpenAI');
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

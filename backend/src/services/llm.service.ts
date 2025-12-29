import type { VideoSummaryResponse } from '../types';
import { llmProviderFactory } from './llm/factory';

class LlmService {
  async summarizeTranscript(
    transcript: string,
    videoTitle?: string
  ): Promise<VideoSummaryResponse> {
    const provider = llmProviderFactory.createProvider();
    return provider.summarizeTranscript(transcript, videoTitle);
  }
}

export const llmService = new LlmService();

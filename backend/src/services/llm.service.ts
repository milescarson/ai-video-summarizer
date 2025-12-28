import type { PrReviewResponse } from '../types';
import { llmProviderFactory } from './llm/factory';

class LlmService {
  async reviewDiff(diff: string, prTitle: string): Promise<PrReviewResponse> {
    const provider = llmProviderFactory.createProvider();
    return provider.reviewDiff(diff, prTitle);
  }
}

export const llmService = new LlmService();

import { LlmProvider } from './base';
import { OpenAiProvider } from './openai.provider';
import { GeminiProvider } from './gemini.provider';
import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export type LlmProviderType = 'openai' | 'gemini';

class LlmProviderFactory {
  private provider: LlmProvider | null = null;

  createProvider(): LlmProvider {
    if (this.provider) {
      return this.provider;
    }

    const providerType = env.LLM_PROVIDER.toLowerCase() as LlmProviderType;

    switch (providerType) {
      case 'openai':
        logger.info('Initializing OpenAI provider');
        if (!env.OPENAI_API_KEY) {
          throw new Error('OPENAI_API_KEY is required when using OpenAI provider');
        }
        this.provider = new OpenAiProvider(
          env.OPENAI_API_KEY,
          env.OPENAI_MODEL || 'gpt-4-turbo-preview'
        );
        break;

      case 'gemini':
        logger.info('Initializing Gemini provider');
        if (!env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY is required when using Gemini provider');
        }
        this.provider = new GeminiProvider(
          env.GEMINI_API_KEY,
          env.GEMINI_MODEL || 'gemini-1.5-pro'
        );
        break;

      default:
        throw new Error(
          `Unsupported LLM provider: ${providerType}. Supported providers are: openai, gemini`
        );
    }

    logger.info(`LLM Provider initialized: ${this.provider.getName()}`);
    return this.provider;
  }

  resetProvider(): void {
    this.provider = null;
  }
}

export const llmProviderFactory = new LlmProviderFactory();

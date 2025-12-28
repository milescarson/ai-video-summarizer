# Multi-Provider LLM Support

## Overview

The PR Review AI backend now supports multiple LLM providers through a clean factory pattern architecture. This allows you to choose between different AI services without changing any code.

## Supported Providers

### 1. OpenAI (GPT-4)

- **Model**: `gpt-4-turbo-preview`
- **Strengths**: Excellent code understanding, structured JSON output, reliable
- **Rate Limits**: 3-3500 RPM depending on tier
- **API Key**: Get from [platform.openai.com](https://platform.openai.com)

### 2. Google Gemini

- **Model**: `gemini-1.5-pro`
- **Strengths**: Long context window (1M tokens), cost-effective, strong reasoning
- **Rate Limits**: 15 RPM (free tier), 1500 requests/day
- **API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Configuration

### Option A: Using OpenAI

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Option B: Using Gemini

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-gemini-api-key-here
```

## Architecture

### Factory Pattern

```
┌──────────────────────┐
│   LlmProviderFactory │
└──────────┬───────────┘
           │ creates
           ├──────────────┬──────────────┐
           ▼              ▼              ▼
    ┌────────────┐ ┌────────────┐ ┌─────────┐
    │  OpenAI    │ │   Gemini   │ │  Future │
    │  Provider  │ │  Provider  │ │ Providers│
    └────────────┘ └────────────┘ └─────────┘
           │              │              │
           └──────────────┴──────────────┘
                      │
                implements
                      │
              ┌───────▼───────┐
              │  LlmProvider  │
              │   Interface   │
              └───────────────┘
```

### Key Components

1. **`LlmProvider` Interface** (`src/services/llm/base.ts`)

   - Defines contract: `reviewDiff()` and `getName()`
   - Shared prompts for consistency across providers

2. **Provider Implementations**

   - `OpenAiProvider` (`src/services/llm/openai.provider.ts`)
   - `GeminiProvider` (`src/services/llm/gemini.provider.ts`)

3. **`LlmProviderFactory`** (`src/services/llm/factory.ts`)

   - Singleton pattern
   - Creates appropriate provider based on `LLM_PROVIDER` env var
   - Validates API keys

4. **Service Layer** (`src/services/llm.service.ts`)
   - Thin wrapper around factory
   - Used by review service

## Adding New Providers

Want to add Claude, Llama, or another provider? Follow these steps:

### 1. Install SDK

```bash
yarn add @anthropic-ai/sdk  # Example for Claude
```

### 2. Update Environment Config

Edit `src/config/env.ts`:

```typescript
LLM_PROVIDER: z.enum(['openai', 'gemini', 'claude']),
```

Add API key validation:

```typescript
.refine(
  (data) => {
    if (data.LLM_PROVIDER === 'claude') return !!data.CLAUDE_API_KEY;
    return true;
  }
)
```

### 3. Create Provider Implementation

Create `src/services/llm/claude.provider.ts`:

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { LlmProvider, SYSTEM_PROMPT, createUserPrompt } from "./base.js";
import { env } from "../../config/env.js";
import type { ReviewResponse } from "../../types/review.types.js";

export class ClaudeProvider implements LlmProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: env.CLAUDE_API_KEY,
    });
  }

  async reviewDiff(diff: string): Promise<ReviewResponse> {
    const response = await this.client.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: createUserPrompt(diff),
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response format from Claude");
    }

    return JSON.parse(content.text);
  }

  getName(): string {
    return "Claude (Anthropic)";
  }
}
```

### 4. Update Factory

Edit `src/services/llm/factory.ts`:

```typescript
import { ClaudeProvider } from './claude.provider.js';

createProvider(): LlmProvider {
  switch (env.LLM_PROVIDER) {
    case 'openai':
      return new OpenAiProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'claude':
      return new ClaudeProvider();
    default:
      throw new Error(`Unsupported LLM provider: ${env.LLM_PROVIDER}`);
  }
}
```

### 5. Update Documentation

- Add to README.md tech stack
- Update API_EXAMPLES.md with new provider
- Add .env.claude.example file

## Prompt Consistency

All providers use the **exact same prompt** defined in `base.ts`:

### System Prompt

```
You are a senior software engineer performing a pull request review.
[... strict rules about only commenting on visible code ...]
```

### User Prompt Structure

```
# Pull Request Review Request

Please review the following git diff and provide structured feedback.

## Diff
[... diff content ...]

## Instructions
[... expected JSON format ...]
```

This ensures consistent review quality regardless of provider.

## Error Handling

Each provider handles its specific errors:

### OpenAI

- Rate limit errors (429)
- Invalid API key (401)
- Model overload (503)

### Gemini

- Quota exceeded (RESOURCE_EXHAUSTED)
- Invalid API key (INVALID_ARGUMENT)
- Safety blocking (SAFETY)

All errors are caught and normalized to user-friendly messages.

## Testing Different Providers

1. **Create test files**:

   ```bash
   cp backend/.env.openai.example backend/.env
   # Fill in OpenAI key and test

   cp backend/.env.gemini.example backend/.env
   # Fill in Gemini key and test
   ```

2. **Compare results**:

   ```bash
   # Test same PR with both providers
   curl -X POST http://localhost:4000/api/review \
     -H "Content-Type: application/json" \
     -d '{"prUrl": "https://github.com/facebook/react/pull/28000"}'
   ```

3. **Benchmark performance**:
   - Response time
   - Review quality
   - Cost per review
   - Rate limits

## Benefits of This Architecture

✅ **Extensibility**: Add new providers in minutes  
✅ **Testability**: Easy to mock providers  
✅ **Consistency**: Same prompt/format across all providers  
✅ **Flexibility**: Switch providers via config, no code changes  
✅ **Maintainability**: Provider logic isolated and focused  
✅ **Type Safety**: Interface contract enforced at compile time

## Future Enhancements

- [ ] Support multiple providers simultaneously (fallback chain)
- [ ] Provider-specific optimizations (temperature, max_tokens)
- [ ] Cost tracking per provider
- [ ] A/B testing framework
- [ ] Provider health monitoring
- [ ] Automatic failover on errors

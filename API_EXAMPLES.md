# API Examples and Testing

## LLM Provider Configuration

The API supports multiple LLM providers. Configure via the `LLM_PROVIDER` environment variable in your `.env` file.

### Using OpenAI (GPT-4)

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-your-key-here
```

**Model Used**: `gpt-4-turbo-preview`  
**Features**: Structured JSON output, excellent code understanding, fast response times

### Using Google Gemini

```env
LLM_PROVIDER=gemini
GEMINI_API_KEY=your-key-here
```

**Model Used**: `gemini-1.5-pro`  
**Features**: Long context window (1M tokens), strong reasoning capabilities, cost-effective

> **Note**: Both providers use identical prompts and return the same response structure. You can switch between them without any client-side changes.

## Using cURL

### Health Check

```bash
curl http://localhost:4000/health
```

**Expected Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### Review PR

```bash
curl -X POST http://localhost:4000/api/review \
  -H "Content-Type: application/json" \
  -d '{
    "prUrl": "https://github.com/facebook/react/pull/28000"
  }'
```

**Expected Response (abbreviated):**

```json
{
  "summary": "This PR introduces...",
  "high_risk_issues": ["Line 42: Potential null pointer exception..."],
  "medium_risk_issues": [],
  "low_risk_or_style_issues": [],
  "suggestions": ["Consider adding unit tests..."],
  "questions_for_author": []
}
```

### Invalid URL Error

```bash
curl -X POST http://localhost:4000/api/review \
  -H "Content-Type: application/json" \
  -d '{
    "prUrl": "https://invalid-url"
  }'
```

**Expected Response:**

```json
{
  "error": "Validation Error",
  "details": [
    {
      "path": "prUrl",
      "message": "Invalid GitHub PR URL format. Expected: https://github.com/owner/repo/pull/123"
    }
  ]
}
```

## Using Postman/Insomnia

### Setup

1. Create new request
2. Method: `POST`
3. URL: `http://localhost:4000/api/review`
4. Headers: `Content-Type: application/json`
5. Body (JSON):

```json
{
  "prUrl": "https://github.com/facebook/react/pull/28000"
}
```

### Collections

**Collection: PR Review API**

**Request 1: Health Check**

- Method: `GET`
- URL: `http://localhost:4000/health`

**Request 2: Review Small PR**

- Method: `POST`
- URL: `http://localhost:4000/api/review`
- Body:

```json
{
  "prUrl": "https://github.com/vercel/next.js/pull/50000"
}
```

**Request 3: Test Error - Invalid URL**

- Method: `POST`
- URL: `http://localhost:4000/api/review`
- Body:

```json
{
  "prUrl": "not-a-url"
}
```

## Using JavaScript/TypeScript

### Fetch API

```typescript
async function reviewPR(prUrl: string) {
  const response = await fetch("http://localhost:4000/api/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prUrl }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to review PR");
  }

  return response.json();
}

// Usage
reviewPR("https://github.com/facebook/react/pull/28000")
  .then((review) => console.log(review))
  .catch((error) => console.error(error));
```

### Axios

```typescript
import axios from "axios";

async function reviewPR(prUrl: string) {
  try {
    const response = await axios.post("http://localhost:4000/api/review", {
      prUrl,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.error || error.message);
    }
    throw error;
  }
}

// Usage
reviewPR("https://github.com/facebook/react/pull/28000")
  .then((review) => console.log(review))
  .catch((error) => console.error(error));
```

## Test Data

### Good PRs for Testing

**Small PR (Fast, ~5-10 seconds):**

```
https://github.com/vercel/next.js/pull/50000
```

**Medium PR (~15-25 seconds):**

```
https://github.com/facebook/react/pull/28000
```

**Large PR (~25-40 seconds):**

```
https://github.com/microsoft/vscode/pull/180000
```

### Error Cases to Test

**Invalid URL Format:**

```json
{ "prUrl": "not-a-valid-url" }
```

**Not a GitHub URL:**

```json
{ "prUrl": "https://gitlab.com/user/repo/merge_requests/1" }
```

**Private Repository (404):**

```json
{ "prUrl": "https://github.com/private/repo/pull/1" }
```

**Non-existent PR (404):**

```json
{ "prUrl": "https://github.com/facebook/react/pull/999999999" }
```

## Response Schema

### Success Response

```typescript
interface ReviewResponse {
  summary: string;
  high_risk_issues: string[];
  medium_risk_issues: string[];
  low_risk_or_style_issues: string[];
  suggestions: string[];
  questions_for_author: string[];
}
```

### Error Response

```typescript
interface ErrorResponse {
  error: string;
  details?: Array<{
    path: string;
    message: string;
  }>;
}
```

## Performance Testing

### Measure Response Time

```bash
time curl -X POST http://localhost:4000/api/review \
  -H "Content-Type: application/json" \
  -d '{
    "prUrl": "https://github.com/facebook/react/pull/28000"
  }'
```

### Concurrent Requests (Load Testing)

```bash
# Install Apache Bench
brew install httpd  # macOS

# Run load test (10 requests, 2 concurrent)
ab -n 10 -c 2 -p data.json -T application/json \
  http://localhost:4000/api/review
```

**data.json:**

```json
{ "prUrl": "https://github.com/facebook/react/pull/28000" }
```

## Debugging Tips

### Check Backend Logs

```bash
cd backend
yarn dev | tee output.log
```

### Enable Verbose Logging

Add to `backend/src/utils/logger.ts`:

```typescript
debug(message: string, meta?: unknown): void {
  if (process.env.NODE_ENV === 'development') {
    this.log('debug', message, meta);
  }
}
```

### Test GitHub API Directly

```bash
curl -H "Authorization: token YOUR_GITHUB_TOKEN" \
  https://api.github.com/repos/facebook/react/pulls/28000
```

### Test OpenAI API Directly

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OPENAI_KEY" \
  -d '{
    "model": "gpt-4-turbo-preview",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.3
  }'
```

## Monitoring

### Watch Logs in Real-Time

```bash
# Terminal 1: Backend logs
cd backend && yarn dev

# Terminal 2: Follow logs
tail -f backend/output.log
```

### Check API Health

```bash
# Create a monitoring script
watch -n 5 'curl -s http://localhost:4000/health | jq'
```

## Rate Limits

### GitHub API

- **Without Token**: 60 requests/hour per IP
- **With Token**: 5000 requests/hour

Check rate limit:

```bash
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/rate_limit
```

### OpenAI API

- Varies by plan (see OpenAI dashboard)
- Typical: 3 requests/minute on free tier
- Typical: 3500 requests/minute on paid tier

### Gemini API

- Free tier: 15 requests/minute, 1500 requests/day
- Check quota: [Google AI Studio](https://makersuite.google.com/app/apikey)

## Comparing Providers

### Speed Test (Same PR)

Test the same PR with both providers to compare response times and quality:

**OpenAI Test:**

```bash
# Set in .env: LLM_PROVIDER=openai
curl -X POST http://localhost:4000/api/review \
  -H "Content-Type: application/json" \
  -d '{"prUrl": "https://github.com/vercel/next.js/pull/50000"}' \
  -w "\nTime: %{time_total}s\n"
```

**Gemini Test:**

```bash
# Set in .env: LLM_PROVIDER=gemini
curl -X POST http://localhost:4000/api/review \
  -H "Content-Type: application/json" \
  -d '{"prUrl": "https://github.com/vercel/next.js/pull/50000"}' \
  -w "\nTime: %{time_total}s\n"
```

> **Tip**: Restart the backend server after changing `LLM_PROVIDER` in `.env`

## Common HTTP Status Codes

- `200`: Success
- `400`: Bad Request (validation error)
- `403`: Forbidden (rate limit or private repo)
- `404`: Not Found (PR doesn't exist)
- `500`: Internal Server Error (server issue)

## Best Practices

1. **Always validate input** before sending to API
2. **Handle errors gracefully** in your client code
3. **Implement retry logic** for transient failures
4. **Cache results** when appropriate
5. **Respect rate limits** (implement backoff)
6. **Use connection pooling** for multiple requests
7. **Set reasonable timeouts** (60s for review endpoint)
8. **Log all API interactions** for debugging

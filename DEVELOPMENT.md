# Project Overview - PR Review AI

## Quick Start

### Automated Setup

```bash
./setup.sh
```

### Manual Setup

**Backend:**

```bash
cd backend
yarn install
cp .env.example .env
# Edit .env with your API keys
# Set LLM_PROVIDER to 'openai' or 'gemini'
# Add corresponding OPENAI_API_KEY or GEMINI_API_KEY
yarn dev
```

**Frontend:**

```bash
cd frontend
yarn install
cp .env.example .env
yarn dev
```

## Development Commands

### Backend

```bash
yarn dev      # Start dev server with hot reload
yarn build    # Build TypeScript to JavaScript
yarn start    # Run production build
yarn lint     # Run ESLint
yarn format   # Format code with Prettier
```

### Frontend

```bash
yarn dev      # Start Vite dev server
yarn build    # Build for production
yarn preview  # Preview production build
yarn lint     # Run ESLint
```

## API Documentation

### POST /api/review

Analyzes a GitHub pull request and returns a structured review.

**Request:**

```json
{
  "prUrl": "https://github.com/owner/repo/pull/123"
}
```

**Response:**

```json
{
  "summary": "Overall assessment of the PR",
  "high_risk_issues": ["Critical issue 1", "Critical issue 2"],
  "medium_risk_issues": ["Issue 1"],
  "low_risk_or_style_issues": ["Style issue 1"],
  "suggestions": ["Suggestion 1"],
  "questions_for_author": ["Question 1"]
}
```

**Errors:**

- `400`: Invalid request (bad URL format)
- `404`: PR not found or repository is private
- `403`: Rate limit exceeded
- `500`: Server error (GitHub API or LLM provider failure)

### GET /health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Technology Decisions

### Why Zustand over Redux?

- Simpler API with less boilerplate
- No context providers needed
- Better TypeScript support out of the box
- Sufficient for single-page app state

### Why React Query?

- Automatic caching and refetching
- Built-in loading/error states
- Request deduplication
- Industry standard for server state

### Why shadcn/ui over Material-UI?

- Full control over components (copy-paste, not yarn install)
- Better performance (only use what you need)
- Modern Radix primitives with Tailwind styling
- Highly customizable

### Why Express over Fastify?

- Larger ecosystem and community
- More familiar to most developers
- Extensive middleware library
- Proven at scale

### Why Octokit over REST client?

- Official GitHub SDK
- Automatic pagination handling
- Built-in rate limiting awareness
- Type definitions included

### Why Factory Pattern for LLM Providers?

- **Extensibility**: Add new providers (Claude, Llama, etc.) without changing existing code
- **Testability**: Easy to mock providers for unit tests
- **Consistency**: All providers implement the same interface
- **Configuration-based**: Switch providers via environment variable, no code changes
- **Separation of Concerns**: Provider-specific logic isolated in dedicated classes

**Current Providers:**

- **OpenAI**: Uses `gpt-4-turbo-preview` model with structured JSON output
- **Gemini**: Uses `gemini-1.5-pro` model with application/json MIME type

**Adding New Providers:**

1. Implement `LlmProvider` interface in `src/services/llm/`
2. Add provider creation logic to `LlmProviderFactory`
3. Update `LLM_PROVIDER` enum in `src/config/env.ts`
4. Add environment variable validation for API key

## Code Organization Principles

### Backend

**Services Layer**: Pure business logic, no HTTP concerns

```typescript
// Good: Pure function
async reviewPullRequest(prUrl: string): Promise<Review>

// Bad: HTTP concepts in service
async reviewPullRequest(req: Request): Promise<Response>
```

**Controllers Layer**: HTTP request/response handling

```typescript
async reviewPullRequest(req: Request, res: Response, next: NextFunction)
```

**No Logic in Routes**: Routes only map URLs to controllers

```typescript
// Good
router.post("/review", reviewController.reviewPullRequest);

// Bad
router.post("/review", async (req, res) => {
  const data = await service.review(req.body);
  res.json(data);
});
```

### Frontend

**No Logic in Components**: Components render, don't process

```typescript
// Good: Logic in custom hook or service
function useReview() {
  return useMutation({ mutationFn: reviewPullRequest });
}

// Bad: API call directly in component
function Component() {
  const handleClick = () => {
    axios.post("/api/review", data);
  };
}
```

**Feature-Based Structure**: Group by feature, not by type

```
features/review/
  ├── api.ts       # API functions
  ├── types.ts     # Feature types
  ├── schema.ts    # Validation
  └── store.ts     # State
```

## Performance Considerations

### Backend

- Single GitHub API call for PR files (pagination handled)
- Diff truncation at 8KB to manage OpenAI token limits
- Express middleware for request logging and error handling
- Async/await throughout for non-blocking I/O

### Frontend

- React Query caching prevents redundant API calls
- Lazy loading for large component trees (can be added)
- Tailwind purging removes unused CSS in production
- Vite for fast HMR and optimized builds

## Security Considerations

### Backend

- Environment variable validation on startup
- Zod validation for all user input
- No raw error messages exposed to client
- CORS enabled (configure for production)
- GitHub token keeps rate limits high

### Frontend

- Input validation before API calls
- Error messages sanitized
- No sensitive data in localStorage
- Environment variables for API URL

## Production Deployment

### Backend (Example: Railway/Render)

```bash
yarn build
npm start
```

Environment variables needed:

- `OPENAI_API_KEY`
- `GITHUB_TOKEN`
- `PORT` (auto-assigned by platform)
- `NODE_ENV=production`

### Frontend (Example: Vercel/Netlify)

```bash
yarn build
# Serve dist/ folder
```

Environment variables needed:

- `VITE_API_BASE_URL` (your backend URL)

### CORS Configuration

Update backend for production:

```typescript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
  })
);
```

## Monitoring & Logging

Current logging:

- Request logging (method, path)
- Error logging with stack traces
- Service-level operation logs

Production additions needed:

- Structured logging (JSON format)
- Error tracking (Sentry)
- Performance monitoring (APM)
- Request ID tracking

## Testing Strategy (Future)

### Backend

- **Unit Tests**: Services, utils (Jest)
- **Integration Tests**: API endpoints (Supertest)
- **E2E Tests**: Full flow (Playwright)

### Frontend

- **Unit Tests**: Hooks, utils (Vitest)
- **Component Tests**: React Testing Library
- **E2E Tests**: User flows (Playwright)

## Common Issues & Solutions

### "Cannot find module '@/\*'"

- Check `tsconfig.json` paths configuration
- Check `vite.config.ts` alias setup
- Restart TypeScript server

### "CORS Error"

- Backend must be running
- Check `VITE_API_BASE_URL` in frontend
- Check CORS configuration in backend

### "Invalid API Key"

- Check `.env` file in backend folder
- Ensure no quotes around key in `.env`
- Restart backend after changing `.env`

### "Rate Limit Exceeded"

- Add GitHub token to increase limits
- Wait for rate limit reset
- Consider caching responses

## Performance Benchmarks

Typical response times:

- Small PR (<10 files): 5-10 seconds
- Medium PR (10-50 files): 15-25 seconds
- Large PR (>50 files): 25-40 seconds

Bottlenecks:

1. OpenAI API call: ~80% of time
2. GitHub API calls: ~15% of time
3. Processing: ~5% of time

## Useful Resources

- [OpenAI API Docs](https://platform.openai.com/docs)
- [GitHub REST API](https://docs.github.com/en/rest)
- [React Query Docs](https://tanstack.com/query/latest)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Zod Documentation](https://zod.dev)

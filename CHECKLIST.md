# PR Review AI - Setup Checklist

## ✅ Pre-Setup

- [ ] Node.js 18+ installed (`node --version`)
- [ ] yarn installed (`yarn --version`)
- [ ] Choose LLM Provider:
  - [ ] OpenAI API key obtained ([platform.openai.com](https://platform.openai.com)), OR
  - [ ] Google AI API key obtained ([makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey))
- [ ] GitHub token obtained (optional) ([github.com/settings/tokens](https://github.com/settings/tokens))

## ✅ Installation

- [ ] Run `./setup.sh` OR manually install dependencies
- [ ] Backend dependencies installed (`cd backend && yarn install`)
- [ ] Frontend dependencies installed (`cd frontend && yarn install`)

## ✅ Configuration

### Backend

- [ ] Created `backend/.env` from `.env.example`
- [ ] Set `LLM_PROVIDER` to either `openai` or `gemini`
- [ ] If using OpenAI: Added `OPENAI_API_KEY` to `backend/.env`
- [ ] If using Gemini: Added `GEMINI_API_KEY` to `backend/.env`
- [ ] Added `GITHUB_TOKEN` to `backend/.env` (optional but recommended)
- [ ] Verified `PORT=4000` in `backend/.env`

### Frontend

- [ ] Created `frontend/.env` from `.env.example`
- [ ] Verified `VITE_API_BASE_URL=http://localhost:4000` in `frontend/.env`

## ✅ First Run

- [ ] Start backend: `cd backend && yarn dev`
- [ ] Backend running at `http://localhost:4000`
- [ ] Health check works: `curl http://localhost:4000/health`
- [ ] Start frontend (new terminal): `cd frontend && yarn dev`
- [ ] Frontend running at `http://localhost:5173`
- [ ] Frontend loads in browser without errors

## ✅ Test the Application

- [ ] Open `http://localhost:5173` in browser
- [ ] UI loads with input field and button
- [ ] Test with sample PR URL (e.g., `https://github.com/facebook/react/pull/28000`)
- [ ] Submit button works
- [ ] Loading state appears
- [ ] Review results display correctly
- [ ] All sections visible: Summary, High Risk, Medium Risk, Low Risk, Suggestions, Questions

## ✅ Verify Code Quality

### Backend

- [ ] Run linter: `cd backend && yarn lint`
- [ ] No TypeScript errors: Check IDE or run `yarn tsc --noEmit`
- [ ] Code formatted: `yarn format`

### Frontend

- [ ] Run linter: `cd frontend && yarn lint`
- [ ] No TypeScript errors: Check IDE
- [ ] Production build works: `yarn build`

## ✅ Common Issues Resolved

- [ ] No CORS errors in browser console
- [ ] No "Cannot find module '@/\*'" errors
- [ ] Environment variables loaded correctly (check console logs)
- [ ] Both servers running on correct ports
- [ ] No port conflicts (4000 and 5173 available)

## ✅ Portfolio Preparation

- [ ] Read `README.md` thoroughly
- [ ] Understand architecture diagram
- [ ] Review prompt design section
- [ ] Test with multiple PR examples
- [ ] Document any issues encountered
- [ ] Take screenshots of working app
- [ ] Prepare demo video (optional)

## ✅ Production Readiness (Future)

- [ ] Set up production backend (Railway, Render, etc.)
- [ ] Set up production frontend (Vercel, Netlify, etc.)
- [ ] Configure CORS for production domain
- [ ] Update `VITE_API_BASE_URL` for production
- [ ] Test production deployment
- [ ] Set up error monitoring (Sentry)
- [ ] Set up analytics (optional)

## 🎯 Key Features to Demonstrate

When showcasing this project, highlight:

1. **Clean Architecture**: Separation of concerns, services layer
2. **Type Safety**: Strict TypeScript throughout
3. **Modern Stack**: React Query, Zustand, shadcn/ui
4. **Validation**: Zod schemas on both client and server
5. **Error Handling**: Graceful error messages, no exposed stack traces
6. **Code Quality**: ESLint, Prettier, clear naming
7. **Extensible LLM Integration**: Factory pattern supporting multiple AI providers (OpenAI, Gemini)
8. **LLM Integration**: Structured prompts, JSON output parsing
9. **API Integration**: GitHub REST API, OpenAI SDK
10. **UI/UX**: Clean, responsive, professional design
11. **Documentation**: Comprehensive README and architecture docs

## 📝 Notes

- Backend logs appear in the terminal where you ran `yarn dev`
- Frontend errors appear in browser console
- First API call may be slower as OpenAI model initializes
- Large PRs (>50 files) may take 30-40 seconds
- GitHub rate limit: 60/hour without token, 5000/hour with token

## 🚀 Next Steps

After basic setup:

1. Review the code in both `backend/src` and `frontend/src`
2. Understand the data flow from input to output
3. Read `DEVELOPMENT.md` for deeper insights
4. Try modifying the LLM prompt in `backend/src/services/llm.service.ts`
5. Customize UI colors in `frontend/tailwind.config.js`
6. Add your own improvements!

## ❓ Need Help?

- Check `DEVELOPMENT.md` for common issues
- Review error messages in backend terminal
- Check browser console for frontend errors
- Verify all environment variables are set correctly
- Ensure both servers are running simultaneously

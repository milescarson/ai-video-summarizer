import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Input,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { SummaryResult } from "@/components/summary";
import {
  summarizeVideo,
  videoUrlSchema,
  useSummaryStore,
} from "@/features/summary";
import { Loader2, Video, Sparkles } from "lucide-react";
import { ZodError } from "zod";

function App() {
  const { videoUrl, setVideoUrl } = useSummaryStore();
  const [error, setError] = useState<string>("");

  const mutation = useMutation({
    mutationFn: summarizeVideo,
    onError: (err: Error) => {
      setError(err.message || "Failed to summarize video");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      videoUrlSchema.parse(videoUrl);
      mutation.mutate({ videoUrl });
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0]?.message || "Invalid video URL");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(239,68,68,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.08),transparent_40%)]" />

      <div className="relative container max-w-6xl mx-auto py-16 px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <div className="relative h-20 w-20 flex items-center justify-center bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-2xl">
                <Video className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent mb-4">
              AI Video Summarizer
            </h1>
            <div className="flex items-center gap-2 text-slate-400">
              <Sparkles className="h-4 w-4" />
              <p className="text-lg">LLM-Powered YouTube Analysis</p>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Transform any YouTube video into actionable insights. Get AI-powered
            summaries, key takeaways, and timestamps in seconds.
          </p>
        </div>

        {/* Input Card */}
        <Card className="mb-8 glass-effect border-slate-800/50 shadow-2xl">
          <CardHeader className="border-b border-slate-800/50">
            <CardTitle className="text-2xl">Analyze Video</CardTitle>
            <CardDescription className="text-slate-400">
              Paste any YouTube URL to extract insights with AI
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  disabled={mutation.isPending}
                  className="flex-1 h-12 bg-slate-900/50 border-slate-700/50 focus:border-red-500/50 focus:ring-red-500/20"
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending || !videoUrl}
                  className="sm:w-40 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Summarize
                    </>
                  )}
                </Button>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400 mt-0.5">⚠</span>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              {mutation.isPending && (
                <div className="text-sm text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-2">
                    <Loader2 className="h-4 w-4 animate-spin mt-0.5" />
                    <span>
                      Fetching transcript and analyzing video... This may take
                      15-30 seconds.
                    </span>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {mutation.isSuccess && mutation.data && (
          <SummaryResult summary={mutation.data} />
        )}
      </div>
    </div>
  );
}

export default App;

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
import { ReviewResult } from "@/components/review";
import {
  reviewPullRequest,
  prUrlSchema,
  useReviewStore,
} from "@/features/review";
import { Loader2 } from "lucide-react";
import { ZodError } from "zod";

function App() {
  const { prUrl, setPrUrl } = useReviewStore();
  const [error, setError] = useState<string>("");

  const mutation = useMutation({
    mutationFn: reviewPullRequest,
    onError: (err: Error) => {
      setError(err.message || "Failed to review PR");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      prUrlSchema.parse(prUrl);
      mutation.mutate({ prUrl });
    } catch (err) {
      if (err instanceof ZodError) {
        setError(err.errors[0]?.message || "Invalid PR URL");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container max-w-5xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex flex-col items-center justify-center mb-4">
            <img
              src="/logo.png"
              alt="PR Review AI Logo"
              className="h-16 w-16 mb-3"
            />
            <h1 className="text-4xl font-bold tracking-tight">PR Review AI</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            LLM-Powered GitHub Pull Request Review Assistant
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Paste a GitHub PR URL and get instant AI-powered code review
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit Pull Request</CardTitle>
            <CardDescription>
              Enter a public GitHub pull request URL to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="https://github.com/owner/repo/pull/123"
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  disabled={mutation.isPending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={mutation.isPending || !prUrl}
                  className="sm:w-32"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Reviewing
                    </>
                  ) : (
                    "Review PR"
                  )}
                </Button>
              </div>

              <p className="text-xs text-amber-600 font-medium">
                ℹ️ Note: Currently supports public PRs only. Private repository
                support coming soon!
              </p>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}

              {mutation.isPending && (
                <div className="text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md p-3">
                  Analyzing pull request... This may take 10-30 seconds.
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {mutation.isSuccess && mutation.data && (
          <ReviewResult review={mutation.data} />
        )}
      </div>
    </div>
  );
}

export default App;

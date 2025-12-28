import type { PrReviewResponse } from "@/features/review";
import { ReviewSection, IssueList } from ".";
import {
  FileText,
  AlertCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  HelpCircle,
} from "lucide-react";

interface ReviewResultProps {
  review: PrReviewResponse;
}

export function ReviewResult({ review }: ReviewResultProps) {
  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      <ReviewSection title="Summary" icon={<FileText className="h-5 w-5" />}>
        <p className="text-sm leading-relaxed">{review.summary}</p>
      </ReviewSection>

      <ReviewSection
        title="High Risk Issues"
        icon={<AlertCircle className="h-5 w-5 text-red-600" />}
      >
        <IssueList items={review.high_risk_issues} variant="high" />
      </ReviewSection>

      <ReviewSection
        title="Medium Risk Issues"
        icon={<AlertTriangle className="h-5 w-5 text-yellow-600" />}
      >
        <IssueList items={review.medium_risk_issues} variant="medium" />
      </ReviewSection>

      <ReviewSection
        title="Low Risk / Style Issues"
        icon={<Info className="h-5 w-5 text-blue-600" />}
      >
        <IssueList items={review.low_risk_or_style_issues} variant="low" />
      </ReviewSection>

      <ReviewSection
        title="Suggestions"
        icon={<Lightbulb className="h-5 w-5 text-green-600" />}
      >
        {review.suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No suggestions at this time.
          </p>
        ) : (
          <ul className="space-y-2">
            {review.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">✓</span>
                <span className="text-sm">{suggestion}</span>
              </li>
            ))}
          </ul>
        )}
      </ReviewSection>

      <ReviewSection
        title="Questions for Author"
        icon={<HelpCircle className="h-5 w-5 text-purple-600" />}
      >
        {review.questions_for_author.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No questions at this time.
          </p>
        ) : (
          <ul className="space-y-2">
            {review.questions_for_author.map((question, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">?</span>
                <span className="text-sm">{question}</span>
              </li>
            ))}
          </ul>
        )}
      </ReviewSection>
    </div>
  );
}

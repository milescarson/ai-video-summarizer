export interface PrReviewRequest {
  prUrl: string;
}

export interface PrReviewResponse {
  summary: string;
  high_risk_issues: string[];
  medium_risk_issues: string[];
  low_risk_or_style_issues: string[];
  suggestions: string[];
  questions_for_author: string[];
}

export interface ReviewState {
  prUrl: string;
  setPrUrl: (url: string) => void;
  clearPrUrl: () => void;
}

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

export interface PrMetadata {
  owner: string;
  repo: string;
  pullNumber: number;
  title: string;
  author: string;
  baseRef: string;
  headRef: string;
}

export interface PrFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  changes: number;
  patch?: string;
}

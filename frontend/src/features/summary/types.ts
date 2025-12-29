export interface VideoSummaryRequest {
  videoUrl: string;
}

export interface VideoSummaryResponse {
  summary: string;
  main_points: string[];
  key_insights: string[];
  actionable_takeaways: string[];
  notable_timestamps: string[];
}

export interface SummaryState {
  videoUrl: string;
  setVideoUrl: (url: string) => void;
  clearVideoUrl: () => void;
}

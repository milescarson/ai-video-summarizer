import { axiosInstance } from "@/lib";
import type { VideoSummaryRequest, VideoSummaryResponse } from "./types";

export async function summarizeVideo(
  data: VideoSummaryRequest
): Promise<VideoSummaryResponse> {
  const response = await axiosInstance.post<VideoSummaryResponse>(
    "/api/summarize",
    data
  );
  return response.data;
}

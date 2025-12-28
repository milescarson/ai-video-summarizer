import { axiosInstance } from "@/lib";
import type { PrReviewRequest, PrReviewResponse } from "./types";

export async function reviewPullRequest(
  data: PrReviewRequest
): Promise<PrReviewResponse> {
  const response = await axiosInstance.post<PrReviewResponse>(
    "/api/review",
    data
  );
  return response.data;
}

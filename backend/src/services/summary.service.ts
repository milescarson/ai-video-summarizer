import { youtubeService, llmService } from '.';
import type { VideoSummaryResponse } from '../types';
import { chunkTranscript, logger } from '../utils';

class SummaryService {
  async summarizeVideo(videoUrl: string): Promise<VideoSummaryResponse> {
    try {
      logger.info(`Starting summarization for video: ${videoUrl}`);

      const transcriptSegments = await youtubeService.getTranscript(videoUrl);

      logger.info(`Fetched ${transcriptSegments.length} transcript segments`);

      if (transcriptSegments.length === 0) {
        return {
          summary: 'This video has no available transcript.',
          main_points: [],
          key_insights: [],
          actionable_takeaways: [],
          notable_timestamps: [],
        };
      }

      const transcript = chunkTranscript(transcriptSegments);

      const summary = await llmService.summarizeTranscript(transcript);

      logger.info('Video summarization completed successfully');

      return summary;
    } catch (error) {
      logger.error('Summary service error', error);
      throw error;
    }
  }
}

export const summaryService = new SummaryService();

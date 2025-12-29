import { Request, Response, NextFunction } from 'express';
import { summaryService } from '../services';
import { videoSummaryRequestSchema } from '../schemas';

export class SummaryController {
  async summarizeVideo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = videoSummaryRequestSchema.parse(req.body);

      const summary = await summaryService.summarizeVideo(validatedData.videoUrl);

      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }
}

export const summaryController = new SummaryController();

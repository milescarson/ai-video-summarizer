import { Request, Response, NextFunction } from 'express';
import { reviewService } from '../services';
import { reviewRequestSchema } from '../schemas';

export class ReviewController {
  async reviewPullRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validatedData = reviewRequestSchema.parse(req.body);

      const review = await reviewService.reviewPullRequest(validatedData.prUrl);

      res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  }
}

export const reviewController = new ReviewController();

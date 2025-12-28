import { Router } from 'express';
import { reviewController } from '../controllers';

const router = Router();

router.post('/review', (req, res, next) => {
  void reviewController.reviewPullRequest(req, res, next);
});

export default router;

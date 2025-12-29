import { Router } from 'express';
import { summaryController } from '../controllers';

const router = Router();

router.post('/summarize', (req, res, next) => {
  void summaryController.summarizeVideo(req, res, next);
});

export default router;

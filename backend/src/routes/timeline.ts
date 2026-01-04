import { Router } from 'express';
import { TimelineController } from '../controllers/timelineController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Routes
router.get('/:date', TimelineController.getTimeline);
router.get('/:date/conflicts', TimelineController.checkTimeConflicts);
router.get('/:date/available-slots', TimelineController.getAvailableSlots);

export default router;

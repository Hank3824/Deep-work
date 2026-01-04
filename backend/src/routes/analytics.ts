import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Routes
router.get('/productivity', AnalyticsController.getProductivityStats);
router.get('/time', AnalyticsController.getTimeStats);
router.get('/trends/tasks', AnalyticsController.getTaskCompletionTrend);
router.get('/distribution/priority', AnalyticsController.getPriorityDistribution);
router.get('/correlation/mood', AnalyticsController.getMoodCorrelation);

export default router;

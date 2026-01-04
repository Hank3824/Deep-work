import { Router } from 'express';
import { MoodController } from '../controllers/moodController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
const createMoodSchema = z.object({
  body: z.object({
    mood: z.string().min(1),
    emoji: z.string().optional(),
    note: z.string().optional(),
    date: z.string(),
  }),
});

// Routes
router.get('/', MoodController.getMoodEntries);
router.post('/', validateRequest(createMoodSchema), MoodController.createMoodEntry);
router.get('/date/:date', MoodController.getMoodEntryByDate);
router.put('/date/:date', MoodController.updateMoodEntry);
router.delete('/date/:date', MoodController.deleteMoodEntry);
router.get('/streak', MoodController.getMoodStreak);
router.get('/stats', MoodController.getMoodStats);

export default router;

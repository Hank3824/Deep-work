import { Router } from 'express';
import { TaskController } from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
    duration: z.number().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    projectIds: z.array(z.number()).optional(),
  }),
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).optional(),
    completed: z.boolean().optional(),
    scheduledDate: z.string().optional(),
    scheduledTime: z.string().optional(),
    duration: z.number().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
    projectIds: z.array(z.number()).optional(),
  }),
});

// Routes
router.get('/', TaskController.getTasks);
router.post('/', validateRequest(createTaskSchema), TaskController.createTask);
router.get('/:id', TaskController.getTaskById);
router.put('/:id', validateRequest(updateTaskSchema), TaskController.updateTask);
router.delete('/:id', TaskController.deleteTask);
router.patch('/:id/complete', TaskController.toggleTaskCompletion);

// Calendar routes
router.get('/calendar/:date', TaskController.getTasksByDate);

export default router;

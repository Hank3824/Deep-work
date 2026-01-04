import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { z } from 'zod';

const router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    color: z.string().optional(),
    description: z.string().optional(),
  }),
});

const updateProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    color: z.string().optional(),
    description: z.string().optional(),
  }),
});

// Routes
router.get('/', ProjectController.getProjects);
router.post('/', validateRequest(createProjectSchema), ProjectController.createProject);
router.get('/:id', ProjectController.getProjectById);
router.put('/:id', validateRequest(updateProjectSchema), ProjectController.updateProject);
router.delete('/:id', ProjectController.deleteProject);
router.get('/:id/stats', ProjectController.getProjectStats);

export default router;

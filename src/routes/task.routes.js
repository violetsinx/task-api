import { Router } from 'express';
import {
  createTaskController,
  listTasksController,
  getTaskController,
  updateTaskController,
  deleteTaskController,
} from '../controllers/task.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { validate } from '../middlewares/validate.js';
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamSchema,
} from '../validators/task.validator.js';

const router = Router();

function validateParams(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      const error = new Error('Validation failed');
      error.status = 400;
      error.details = result.error.issues;
      return next(error);
    }
    req.params = result.data;
    return next();
  };
}

router.use(requireAuth);

router.post('/', validate(createTaskSchema), createTaskController);
router.get('/', listTasksController);
router.get('/:id', validateParams(taskIdParamSchema), getTaskController);
router.patch(
  '/:id',
  validateParams(taskIdParamSchema),
  validate(updateTaskSchema),
  updateTaskController,
);
router.delete('/:id', validateParams(taskIdParamSchema), deleteTaskController);

export default router;

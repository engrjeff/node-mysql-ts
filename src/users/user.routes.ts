import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import userController from './user.controller';
import { validateUserCreate, validateUserUpdate } from './user.schema';

const router = Router();

// authenticate
router.use(authenticate);

router
  .route('/')
  .get(userController.getAll)
  .post(validateUserCreate, userController.create)
  .delete(userController.removeMany);

router
  .route('/:id')
  .get(userController.getById)
  .put(validateUserUpdate, userController.update)
  .delete(userController.remove);

export default router;

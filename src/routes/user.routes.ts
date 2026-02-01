import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateUserSchema } from '../validators/user.validator';

const router = Router();
const userController = new UserController();

router.get('/me', authenticate, userController.getCurrentUser);
router.patch('/me', authenticate, validate(updateUserSchema), userController.updateUser);
router.delete('/me', authenticate, userController.deleteUser);

export default router;

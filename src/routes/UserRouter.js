import { Router } from 'express';
import * as userController from '../controllers/UserController.js';

const router = Router();

router.get('/user/:id', userController.getUserById);

export default router;

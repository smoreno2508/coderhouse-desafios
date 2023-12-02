import { Router } from 'express';
import * as userController from '../controllers/UserController.js';
import * as sessionController from '../controllers/SessionController.js';

const router = Router();

router.post('/login', sessionController.passportLocalLogin);

router.post("/register", userController.addUser);

router.get("/logout", sessionController.logout);

router.get("/auth/github", sessionController.passportGithubLogin);

router.get("/auth/github/callback", sessionController.passportGithubCallback);

export default router;

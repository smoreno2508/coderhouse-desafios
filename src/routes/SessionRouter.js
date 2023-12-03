import { Router } from 'express';
import * as userController from '../controllers/UserController.js';
import * as sessionController from '../controllers/SessionController.js';
import passport from 'passport';

const router = Router();

router.post('/login', sessionController.passportJWTLogin);

router.post("/register", userController.addUser);

router.get("/logout", sessionController.logout);

router.get("/auth/github", sessionController.passportGithubLogin);

router.get("/auth/github/callback", sessionController.passportGithubCallback);

router.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ message: 'User information', user: req.user });
});

export default router;

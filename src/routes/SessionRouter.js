import { Router } from 'express';
import * as userController from '../controllers/UserController.js';
import passport from 'passport';

const router = Router();

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));


router.post("/register", userController.addUser);

router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
    res.redirect('/login');
});

router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/auth/github/callback", passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

export default router;

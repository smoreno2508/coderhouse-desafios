import passport from 'passport';


const passportLocalLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})

const passportGithubLogin = passport.authenticate("github", { scope: ["user:email"] });

const passportGithubCallback = passport.authenticate("github", {
    successRedirect: "/",
    failureRedirect: "/login"
})


const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
    });
    res.redirect('/login');
}

export {
    passportLocalLogin,
    passportGithubLogin,
    passportGithubCallback,
    logout
};
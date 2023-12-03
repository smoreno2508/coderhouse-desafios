import passport from 'passport';
import jwt from 'jsonwebtoken';

const generateJwt = (user) => {
    const expiresIn = 60 * 60; // 1 hour
    const payload = {
        id: user._id,
        iat: Date.now()
    };
    const signedToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiresIn });
    return {
        token: signedToken,
        expires: expiresIn
    }
}

const passportLocalLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
})

const passportJWTLogin = (req, res, next) => {
    passport.authenticate('local',{ failureRedirect: "/login" }, async (err, user, info) => {
            try {
                if (info) {
                    return res.render("login", { messages: info.message });
                }

                req.login(user, { session: false }, async (error) => {
                    if (error) return next(error);

                    const jwt = generateJwt(user);
                    console.log(jwt);
                    const { firstName, lastName, email, age, role } = user;
                    return res.json({ firstName, lastName, email, age, role, expiresIn: jwt.expires });
                });
            } catch (error) {
                return next(error);
            }
        })(req, res, next);
}

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
    passportJWTLogin,
    logout
};
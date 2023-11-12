import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { userService } from '#services/index.js';

config();

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await userService.getUserbyEmail(email);

    if (!user) {
      return done(null, false, { message: 'Incorrect email.' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, { message: 'Incorrect password.' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


// Github Strategy

passport.use(new GithubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/api/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await userService.getUserbyEmail(profile._json.email);
        if (!user) {
            const newUser = await userService.addUser({
                firstName: profile.displayName,
                lastName: profile.displayName,
                email: profile._json.email,
                password: profile.id,
                isGithub: true,
            });
            return done(null, newUser);
        }
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

export default passport;

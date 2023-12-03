import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2';
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { userService } from '#services/index.js';

config();

passport.use(new LocalStrategy({
  passReqToCallback: true,
  usernameField: 'email',
  passwordField: 'password'
}, async (req, email, password, done) => {
  try {
    const user = await userService.getUserbyEmail(email);

    if (!user) {
      return done(null, false, { message: 'Incorrect password or email.' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return done(null, false, { message: 'Incorrect password or email.' });
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
  callbackURL: "http://localhost:8080/api/auth/github/callback",
  scope: ["user:email"]
}, async (accessToken, refreshToken, profile, done) => {
  try {

    const user = await userService.getUserbyEmail(profile.emails[0].value);


    if (!user) {
      const newUser = await userService.addUser({
        firstName: profile.username,
        lastName: profile.username,
        email: profile.emails[0].value,
        password: profile.id,
        age: 0,
        isGithub: true,
      });

      return done(null, newUser);
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));


// JWT Strategy

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (jwtPayload, done) => {
  try {
  
    const user = await userService.getUserById(jwtPayload.id);

    if (!user) {
      return done(null, false, { message: 'Incorrect password or email.' });
    }
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}
));



export default passport;




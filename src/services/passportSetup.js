import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import googleOauth from "passport-google-oauth2";
import facebookOauth from "passport-facebook";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../../config/.env") });
const GoogleStrategy = googleOauth.Strategy;
const FacebookStrategy = facebookOauth.Strategy;
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: process.env.googleCallbackURL,
      passReqToCallback: true,
    },
    (request, accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FacebookClientID,
      clientSecret: process.env.FacebookClientSecret,
      callbackURL: process.env.FacebookCallbackURL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

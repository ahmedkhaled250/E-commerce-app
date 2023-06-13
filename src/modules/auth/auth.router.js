import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoint } from "./auth.endPoint.js";
import passport from "passport";
import * as validators from "./auth.validation.js";
import * as registerController from "./controller/registration.js";
const router = Router();
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope:"email"})
);
router.get("/fail", registerController.failSocialLogin);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `api/v1/auth/fail`,
  }),
  registerController.googleCallback
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: `api/v1/auth/fail`,
  }),
  registerController.facebookCallback
);
router.get("/views",registerController.views);
router.post(
  "/signup",
  validation(validators.signup),
  registerController.signup
);
router.post("/login", validation(validators.signin), registerController.login);
router.patch(
  "/logout",
  validation(validators.logOut),
  auth(endPoint.logOut),
  registerController.logOut
);
router.get(
  "/confirmEmail/:token",
  validation(validators.token),
  registerController.confirmEmail
);
router.get(
  "/refreshEmail/:token",
  validation(validators.token),
  registerController.refreshEmail
);
export default router;

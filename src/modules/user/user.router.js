import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as validators from "./user.validation.js";
import * as userController from "./controller/user.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./user.endPoint.js";
const router = Router();
router.patch(
  "/ProfilePic",
  validation(validators.ProfilePic),
  auth(endPoint.AllRoles),
  myMulter(fileValidation.image).single("image"),
  userController.ProfilePic
);
router.patch(
  "/deleteProfilePic",
  validation(validators.ProfilePic),
  auth(endPoint.AllRoles),
  userController.deleteProfilePic
);
router.put(
  "/updateProfile",
  validation(validators.updateProfile),
  auth(),
  userController.updateProfile
);
router.patch(
  "/sendCode",
  validation(validators.sendCode),
  userController.sendCode
);
router.patch(
  "/forgetPssword",
  validation(validators.forgetPssword),
  userController.forgetPssword
);
router.patch(
  "/updatePassword",
  validation(validators.updatePassword),
  auth(endPoint.AllRoles),
  userController.updatePassword
);
router.patch(
  "/softdelete",
  validation(validators.headers),
  auth(endPoint.AllRoles),
  userController.softdelete
);
router.patch(
  "/:id/blockUser",
  validation(validators.blockAccount),
  auth(endPoint.blockAccount),
  userController.blockAccount
);
router.get(
  "/:id",
  validation(validators.getUserById),
  userController.getUserById
);
router.get("/", userController.users);
export default router;

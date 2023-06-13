import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./brand.endPoint.js";
import * as validators from "./brand.validation.js";
import * as brandController from "./controller/brand.js";
const router = Router();
router.post(
  "/",
  myMulter(fileValidation.image).single("image"),
  validation(validators.createBrand),
  auth(endPoint.createBrand),
  brandController.createBrand
);
router.put(
  "/:id",
  validation(validators.updateBrand),
  auth(endPoint.updateBrand),
  myMulter(fileValidation.image).single("image"),
  brandController.updateBrand
);
router.get("/", validation(validators.getBrands), brandController.brands);

export default router;

import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import * as validators from "./subcategory.validation.js";
import product from "../product/product.router.js";
import * as subCategoryController from "./controller/subcategory.js";
import { endPoint } from "./subcategory.endPoint.js";
const router = Router({ mergeParams: true });
router.use("/:subCategoryId/product", product);
router.post(
  "/",
  myMulter(fileValidation.image).single("image"),
  validation(validators.createSubCategory),
  auth(endPoint.addSubCategory),
  subCategoryController.addSubCategory
);
router.put(
  "/:subCategoryId",
  validation(validators.updateSubCategory),
  auth(endPoint.updateCategory),
  myMulter(fileValidation.image).single("image"),
  subCategoryController.updateSubCategory
);
router.get(
  "/:id",
  validation(validators.getSubCategoryById),
  subCategoryController.getSubCategoryById
);
export default router;

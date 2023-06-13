import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import { endPoint } from "./category.endPoint.js";
import subCategory from "../subcategory/subcategory.router.js";
import product from "../product/product.router.js";
import * as catyegoryController from "./controller/category.js";
import * as validators from "./category.validation.js";
import { validation } from "../../middleware/validation.js";
const router = Router();
router.use("/:categoryId/subCategory", subCategory);
router.use("/:categoryId/product", product);
router.post(
  "/",
  myMulter(fileValidation.image).single("image"),
  validation(validators.createCategory),
  auth(endPoint.createCategory),
  catyegoryController.createCategory
);
router.put(
  "/:id",
  validation(validators.updateCategory),
  auth(endPoint.updateCategory),
  myMulter(fileValidation.image).single("image"),
  catyegoryController.updateCategory
);
router.get(
  "/:id",
  validation(validators.getCategoryById),
  catyegoryController.getCategoryById
);
router.get("/", catyegoryController.categories);
export default router;

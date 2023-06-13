import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import * as productController from "./controller/product.js";
import * as validators from "./product.validation.js";
import wishList from "../wishList/wishList.router.js";
import cart from "../cart/cart.router.js";
import order from "../order/order.router.js";
import review from "../reviews/reviews.router.js";
import { endPoint } from "./product.endPoint.js";
import { validation } from "../../middleware/validation.js";
const router = Router({ mergeParams: true });
router.use("/:productId/wishlist", wishList);
router.use("/:productId/review", review);
router.use("/:productId/cart", cart);
router.use("/:productId/order", order);
router.post(
  "/",
  auth(endPoint.createProduct),
  myMulter(fileValidation.image).array("images", 5),
  validation(validators.createProduct),
  productController.createProduct
);
router.put(
  "/:id",
  validation(validators.updateProduct),
  auth(endPoint.updateProduct),
  myMulter(fileValidation.image).single("file"),
  productController.updateProduct
);
router.get(
  "/productsOfSpecificSubcategory",
  validation(validators.productsOfSpecificSubcategory),
  productController.productsOfSpecificSubcategory
);
router.get(
  "/productsOfSpecificCategory",
  validation(validators.productsOfSpecificCategory),
  productController.productsOfSpecificCategory
);
router.get("/", validation(validators.products), productController.products);
router.get("/searsh/:name", validation(validators.searsh), productController.searsh);
router.patch(
  "/softDeleteProduct/:id",
  validation(validators.softDeleteProduct),
  auth(endPoint.softDeleteProduct),
  productController.softDeleteProduct
);
export default router;

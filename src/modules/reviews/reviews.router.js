import { Router } from "express";
import * as reviewController from "./controller/review.js";
import * as validators from "./reviews.validation.js";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./reviews.endPoint.js";
import { validation } from "../../middleware/validation.js";
const router = Router({ mergeParams: true });
router.post(
  "/",
  validation(validators.addReview),
  auth(endPoint.addReview),
  reviewController.addReview
);
router.put(
  "/",
  validation(validators.updateReview),
  auth(endPoint.updateReview),
  reviewController.updateReview
);
router.delete(
  "/:reviewId",
  validation(validators.deleteReview),
  auth(endPoint.updateReview),
  reviewController.deleteReview
);
router.get(
  "/getReviewWithProduct",
  validation(validators.getReviewProduct),
  reviewController.getReviewsProduct
);
router.get(
  "/getReviewWithProductAndUser",
  validation(validators.getReviewProductUser),
  auth(endPoint.addReview),
  reviewController.getReviewProductUser
);
export default router;

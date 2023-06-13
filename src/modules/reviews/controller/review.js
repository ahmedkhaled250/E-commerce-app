import {
  create,
  find,
  findById,
  findOne,
  findOneAndDelete,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import reviewModel from "../../../../DB/model/review.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const addReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { _id } = req.user;
  const { rating, message } = req.body;
  const user = await findById({ model: userModel, condition: _id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      const checkedReview = await findOne({
        model: reviewModel,
        condition: { userId: user._id, productId },
      });
      if (checkedReview) {
        return next(new Error("Already reviewsed by you", { cause: 409 }));
      }
      const order = await findOne({
        model: orderModel,
        condition: {
          userId: _id,
          status: "received",
          "products.productId": productId,
        },
      });
      if (!order) {
        return next(
          new Error("Sorry, must be have finish your order first", {
            cause: 400,
          })
        );
      }
      const review = await create({
        model: reviewModel,
        data: { rating, message, userId: _id, productId },
      });
      if (review) {
        const reviews = await find({
          model: reviewModel,
          condition: { productId },
        });
        let sumRating = 0;
        for (const review of reviews) {
          sumRating += review.rating;
        }
        let avrageRate = sumRating / reviews.length;
        avrageRate = avrageRate.toFixed(1);
        await findOneAndUpdate({
          model: productModel,
          condition: { _id: productId },
          data: { $push: { review: review._id }, rating: avrageRate },
        });
        return res.status(201).json({ message: "Done", review });
      } else {
        return next(new Error("Fail to creat review", { cause: 400 }));
      }
    }
  }
});
export const updateReview = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const { _id } = req.user;
  const { rating, message } = req.body;
  const user = await findById({ model: userModel, condition: _id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const order = await findOne({
    model: orderModel,
    condition: {
      userId: _id,
      status: "received",
      "products.productId": productId,
    },
  });
  if (!order) {
    return next(
      new Error("Sorry, must be have finish your order first", { cause: 404 })
    );
  }
  const updateReview = await findOneAndUpdate({
    model: reviewModel,
    condition: { userId: _id, productId },
    data: { rating, message },
    option: { new: true },
  });
  if (!updateReview) {
    return next(new Error("Fail to update review", { cause: 400 }));
  } else {
    const reviews = await find({
      model: reviewModel,
      condition: { productId },
    });
    let sumRating = 0;
    for (const review of reviews) {
      sumRating += review.rating;
    }
    let avrageRate = sumRating / reviews.length;
    avrageRate = avrageRate.toFixed(1);
    await findOneAndUpdate({
      model: productModel,
      condition: { _id: productId },
      data: { rating: avrageRate },
    });
    return res.status(200).json({ message: "Done", updateReview });
  }
});
export const deleteReview = asyncHandler(async (req, res, next) => {
  const { reviewId } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const deleteReview = await findOneAndDelete({
    model: reviewModel,
    condition: { _id: reviewId, userId: user._id },
  });
  if (deleteReview) {
    const reviews = await find({
      model: reviewModel,
      condition: { productId: deleteReview.productId },
    });
    let sumRating = 0;
    for (const review of reviews) {
      sumRating += review.rating;
    }
    let avrageRate;
    if (sumRating === 0) {
      avrageRate = 0;
    } else {
      avrageRate = sumRating / reviews.length;
    }
    avrageRate = avrageRate.toFixed(1);
    await findOneAndUpdate({
      model: productModel,
      condition: { _id: deleteReview.productId },
      data: { rating: avrageRate, $pull: { review: deleteReview._id } },
    });
    return res.status(200).json({ message: "Done", deleteReview });
  } else {
    return next(new Error("In-valid review", { cause: 404 }));
  }
});
export const getReviewsProduct = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await findOne({
    model: productModel,
    condition: { _id: productId, deleted: false },
    populate: [
      { path: "createdBy", select: "userName email image" },
      { path: "categoryId", select: "name image" },
      { path: "subCategoryId", select: "name image" },
      { path: "brandId", select: "name logo" },
      { path: "review" },
    ],
  });
  if (!product) {
    return next(new Error("In-valid product ID", { cause: 404 }));
  }
  return res.status(200).json({ message: "Done", product });
});
export const getReviewProductUser = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const product = await findOne({
    model: productModel,
    condition: { _id: productId, deleted: false },
  });
  if (!product) {
    return next(new Error("In-valid product", { cause: 404 }));
  }
  const populate = [
    { path: "productId" },
    { path: "userId", select: "userName email image" },
  ];
  const review = await findOne({
    model: reviewModel,
    condition: { productId, userId: req.user._id },
    populate,
  });
  if (review) {
    return res.status(200).json({ message: "Done", review });
  } else {
    return next(new Error("In-valid review", { cause: 404 }));
  }
});

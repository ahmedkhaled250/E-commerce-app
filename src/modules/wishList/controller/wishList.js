import { findOne, updateOne } from "../../../../DB/DBMethods.js";
import productModel from "../../../../DB/model/Product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const add = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await findOne({
    model: productModel,
    condition: { _id: productId },
  });
  if (!product) {
    return next(new Error("In-valid product ID", { cause: 404 }));
  }
  await updateOne({
    model: userModel,
    condition: { _id: req.user._id },
    data: { $push: { wishList: product._id } },
  });
  return res.status(200).json({ message: "Done" });
});
export const remove = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await findOne({
    model: productModel,
    condition: { _id: productId },
  });
  if (!product) {
    return next(new Error("In-valid product ID"));
  }
  await updateOne({
    model: userModel,
    condition: { _id: req.user._id },
    data: { $pull: { wishList: product._id } },
  });
  return res.status(200).json({ message: "Done" });
});

import {
  create,
  find,
  findById,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const addToCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { products } = req.body;
  const user = await findById({ model: userModel, condition: _id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account stopped", { cause: 400 }));
    } else {
      const cart = await findOne({
        model: cartModel,
        condition: { userId: user._id },
      });
      if (!cart) {
        const addCart = await create({
          model: cartModel,
          data: { userId: user._id, products },
        });
        return res.status(201).json({ message: "Done", addCart });
      }
      for (const product of products) {
        let match = false;
        for (let i = 0; i < cart.products.length; i++) {
          if (product.productId == cart.products[i].productId.toString()) {
            cart.products[i] = product;
            match = true;
            break;
          }
        }
        if (!match) {
          cart.products.push(product);
        }
      }
      const result = await findOneAndUpdate({
        model: cartModel,
        condition: { _id: cart._id, userId: user._id },
        data: { products: cart.products },
        option: { new: true },
      });
      return res.status(200).json({ message: "Done", result });
    }
  }
});
export const userCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const user = await findById({ model: userModel, condition: _id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      const cart = await findOne({
        model: cartModel,
        condition: { userId: user._id },
      });
      for (const product of cart.products) {
        const productId = await findById({
          model: productModel,
          condition: product.productId,
        });
        product.productId = productId;
      }
      return res.status(200).json({ message: "Done", cart });
    }
  }
});
export const deleteProductFromCart = asyncHandler(async (req, res, next) => {
  const { cartId, productId } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      const cart = await findOne({
        model: cartModel,
        condition: { _id: cartId, userId: user._id },
      });
      if (!cart) {
        return next(new Error("In-valid cart", { cause: 404 }));
      } else {
        for (let i = 0; i < cart.products.length; i++) {
          if (cart.products[i].productId.toString() == productId) {
            cart.products.splice(i, 1);
            break;
          }
        }
        const updateCart = await findOneAndUpdate({
          model: cartModel,
          condition: { userId: user._id, _id: cart._id },
          data: { products: cart.products },
          option: { new: true },
        });
        if (!updateCart) {
          return next(new Error("Fail to update cart", { cause: 400 }));
        } else {
          return res.status(200).json({ message: "Done", updateCart });
        }
      }
    }
  }
});
export const removeProductsFromCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      const cart = await findOne({
        model: cartModel,
        condition: { _id: cartId, userId: user._id },
      });
      if (!cart) {
        return next(new Error("In-valid cartId", { cause: 404 }));
      }
      cart.products.splice(0, cart.products.length);
      const updateCart = await findOneAndUpdate({
        model: cartModel,
        condition: { _id: cart._id, userId: user._id },
        data: { products: cart.products },
        option: { new: true },
      });
      if (!updateCart) {
        return next(new Error("Fail to Update cart", { cause: 400 }));
      } else {
        return res.status(200).json({ message: "Done", updateCart });
      }
    }
  }
});

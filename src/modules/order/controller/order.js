import {
  create,
  findById,
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
  findOneAndDelete,
  find,
} from "../../../../DB/DBMethods.js";
import coponModel from "../../../../DB/model/Copon.model.js";
import orderModel from "../../../../DB/model/Order.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const createOrder = asyncHandler(async (req, res, next) => {
  const { coponId, products } = req.body;
  const { _id } = req.user;
  const user = await findById({ model: userModel, condition: _id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const finalList = [];
  const productIds = [];
  let sumTotal = 0;
  for (let i = 0; i < products.length; i++) {
    for (const product of productIds) {
      if (product.toString() === products[i].productId.toString()) {
        return next(
          new Error(
            "You can't duplicate the same product tow times in the same order",
            { cause: 400 }
          )
        );
      }
    }
    productIds.push(products[i].productId);
    const checkItem = await findOne({
      model: productModel,
      condition: {
        _id: products[i].productId,
        stock: { $gte: products[i].quantity },
      },
    });
    if (!checkItem) {
      return next(new Error("In-valid place for this order", { cause: 409 }));
    }
    products[i].unitPrice = checkItem.finalPrice;
    products[i].totalPrice = checkItem.finalPrice * products[i].quantity;
    sumTotal += products[i].totalPrice;
    finalList.push(products[i]);
  }
  req.body.sumTotal = sumTotal;
  req.body.finalPrice = sumTotal;
  let checkCopon;
  if (coponId) {
    checkCopon = await findOne({
      model: coponModel,
      condition: { _id: coponId, deleted: false, usedBy: { $nin: user._id } },
    });
    if (!checkCopon) {
      return next(new Error("In-valid coupon", { cause: 404 }));
    }
    req.body.finalPrice = sumTotal - sumTotal * (checkCopon.amount / 100);
  }
  req.body.userId = user._id;
  req.body.products = finalList;
  const order = await create({
    model: orderModel,
    data: req.body,
  });
  if (order) {
    if (checkCopon) {
      await findByIdAndUpdate({
        model: coponModel,
        condition: coponId,
        data: { $push: { usedBy: user._id } },
      });
    }
    for (const product of order.products) {
      const productId = await findById({
        model: productModel,
        condition: product.productId,
      });
      await findOneAndUpdate({
        model: productModel,
        condition: product.productId,
        data: {
          stock: productId.stock - product.quantity,
          soldItem: productId.soldItem + product.quantity,
        },
      });
    }
    return res.status(201).json({ message: "Done", order });
  } else {
    return next(new Error("Fail to place your order", { cause: 400 }));
  }
});
export const deleteFromOrder = asyncHandler(async (req, res, next) => {
  const { orderId, productId } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const checkProduct = await findById({
    model: productModel,
    condition: productId,
  });
  if (!checkProduct) {
    return next(new Error("In-valid product id", { cause: 404 }));
  }
  const order = await findOne({
    model: orderModel,
    condition: { _id: orderId, userId: user._id },
  });
  if (!order) {
    return next(new Error("In-valid order", { cause: 404 }));
  }
  let product = {};
  for (let i = 0; i < order.products.length; i++) {
    if (order.products[i].productId.toString() == productId) {
      product = order.products[i];
      order.products.splice(i, 1);
      break;
    }
  }
  let checkCopon;
  if (order.products.length) {
    if (!product) {
      return next(
        new Error("Already You deleted this product", { cause: 400 })
      );
    }
    order.sumTotal -= product.totalPrice;
    order.finalPrice = order.sumTotal;
    if (order.coponId) {
      checkCopon = await findOne({
        model: coponModel,
        condition: { _id: order.coponId, deleted: false },
      });
      if (!checkCopon) {
        return next(new Error("In-valid copon", { cause: 404 }));
      }
      order.finalPrice = order.sumTotal * (checkCopon.amount / 100);
    }
    const updateOrder = await findOneAndUpdate({
      model: orderModel,
      condition: { _id: order._id, userId: user._id },
      data: {
        products: order.products,
        sumTotal: order.sumTotal,
        finalPrice: order.finalPrice,
      },
      option: { new: true },
    });
    if (updateOrder) {
      await findOneAndUpdate({
        model: productModel,
        condition: { _id: checkProduct._id },
        data: {
          stock: checkProduct.stock + product.quantity,
          soldItem: checkProduct.soldItem - product.quantity,
        },
      });

      res.status(200).json({ message: "Done", updateOrder });
    } else {
      return next(
        new Error("Fail to delet this product from order", { cause: 400 })
      );
    }
  } else {
    if (order.coponId) {
      await findByIdAndUpdate({
        model: coponModel,
        condition: order.coponId,
        data: { $pull: { usedBy: user._id } },
      });
    }
    await findByIdAndUpdate({
      model: productModel,
      condition: checkProduct._id,
      data: {
        stock: checkProduct.stock + product.quantity,
        soldItem: checkProduct.soldItem - product.quantity,
      },
    });
    const delteOrder = await findOneAndDelete({
      model: orderModel,
      condition: { _id: orderId, userId: user._id },
    });
    return res.status(200).json({ message: "Done", _id: delteOrder._id });
  }
});
export const userOrders = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  }
  if (user.deleted) {
    return next(new Error("Your account is stopped", { cause: 400 }));
  }
  const orders = await find({
    model: orderModel,
    condition: { userId: user._id },
  });
  for (const order of orders) {
    let products = [];
    for (let i = 0; i < order.products.length; i++) {
      const product = await findById({
        model: productModel,
        condition: order.products[i].productId,
      });
      products.push({
        productId: product,
        unitPrice: order.products[i].unitPrice,
        quantity: order.products[i].quantity,
        totalPrice: order.products[i].totalPrice,
      });
    }
    order.products = products;
  }
  return res.status(200).json({ message: "Done", orders });
});

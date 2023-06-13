import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "Product",
          unique: true,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        unitPrice: {
          type: Number,
          default: 1,
        },
        totalPrice: {
          type: Number,
          default: 1,
        },
      },
    ],
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not order without owner"],
    },
    address: { type: String, required: [true, "address is required"] },
    phone: { type: String, required: [true, "phone is required"] },
    sumTotal: {
      type: Number,
      default: 1,
    },
    finalPrice: {
      type: Number,
      default: 1,
    },
    coponId: {
      type: Types.ObjectId,
      ref: "Copon",
    },
    status: {
      type: String,
      enum: ["placed", "received", "rejected", "preparing", "onWay"],
      default: "placed",
    },
    paymentMethod: {
      type: String,
      default: "Cash",
      enum: ["Cash", "Visa"],
    },
  },
  {
    timestamps: true,
  }
);

const orderModel = model("Order", orderSchema);
export default orderModel;

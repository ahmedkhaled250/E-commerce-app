import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema(
  {
    products: {
      type: [
        {
          productId: {
            type: Types.ObjectId,
            ref: "Product",
            required: true,
            unique: true,
          },
          quantity: {
            type: Number,
            default: 1,
          },
        },
      ],
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not cart without owner"],
      unique:true
    },

  },
  {
    timestamps: true,
  }
);

const cartModel = model("Cart", cartSchema);
export default cartModel;

import { Schema, Types, model } from "mongoose";

const reviewSchema = new Schema(
  {
    message: {
      type: String,
      required: [true, "message is required"],
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not review without owner"],
    },
    productId: {
      type: Types.ObjectId,
      ref: "Product",
      required: [true, "can not copon without product"],
    },
    rating: {
      type: Number,
      required: true,
      min:[1,'minimum rating 1'],
      max:[5,'maximum rating 5']
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = model("Review", reviewSchema);
export default reviewModel;

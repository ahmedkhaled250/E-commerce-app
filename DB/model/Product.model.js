import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      unique: [true, "name must be unique value"],
      required: [true, "name is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 20 char"],
      lowercase: true,
      trim: true,
    },
    slug: String,
    description: String,
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 1,
    },
    discound: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
      default: 1,
    },
    soldItem: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    deleted: { type: Boolean, default: false },
    colors: [String],
    size: { type: [String], enum: ["s", "m", "l", "xl"] },
    images: {
      type: [String],
      required: [true, "Image is required"],
    },
    imagesPublicIds: [String],
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not product without owner"],
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "categoryId is required"],
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
      required: [true, "subCategoryId is required"],
    },
    brandId: {
      type: Types.ObjectId,
      ref: "Brand",
      required: [true, "Brand is required"],
    },
    review: {
      type: [Types.ObjectId],
      ref: "Review",
    },
    rating: {
      type: Number,
      min: [1, "minimum rating 1"],
      max: [5, "maximum rating 5"],
    },
  },
  {
    timestamps: true,
  }
);

const productModel = model("Product", productSchema);
export default productModel;

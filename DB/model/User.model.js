import { Schema, Types, model } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "minimum length 2 char"],
      max: [20, "max length 2 char"],
    },
    email: {
      type: String,
      unique: [true, "email must be unique value"],
    },
    password: String,
    phone: {
      type: String,
      min:[11,'minimum length 11 char'],
      max:[11,'maximum length 11 char'],
    },
    address: {
      type: String,
      min:[5,'minimum length 5 char'],
      max:[50,'maximum length 50 char'],
    },
    gender:{
      type: String,
      default: "Male",
      enum: ["Male", "Female"],
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin", "Accouting"],
    },
    accountType: {
      type: String,
      default: "normal",
    },
    socialId: String,
    DOB: Date,
    active: {
      type: Boolean,
      default: false,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    code: String,
    image: String,
    imagePublicId: String,
    wishList: [{ type: Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);
const userModel = model("User", userSchema);
export default userModel;

import e from "express";
import slugify from "slugify";
import {
  create,
  find,
  findById,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handleError.js";
import { paginate } from "../../../services/pagination.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your accouet is stopped", { cause: 400 }));
    } else {
      if (!name) {
        return next(new Error("Name is required", { cause: 400 }));
      } else {
        const category = await findOne({
          model: categoryModel,
          condition: { name },
        });
        if (category) {
          return next(new Error("Name is dublicated", { cause: 400 }));
        } else {
          if (!req.file) {
            return next(new Error("image is required", { cause: 400 }));
          } else {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
              req.file.path,
              {
                folder: `E-commerce/category/${user._id}`,
              }
            );
            const newCategory = await create({
              model: categoryModel,
              data: {
                name,
                slug: slugify(name),
                image: secure_url,
                imagePublicId: public_id,
                createdBy: user._id,
              },
            });
            return res.status(201).json({ message: "Done", newCategory });
          }
        }
      }
    }
  }
});
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your accouet is stopped", { cause: 400 }));
    } else {
      const category = await findOne({
        model: categoryModel,
        condition: {
          _id: id,
          createdBy: user._id,
        },
      });
      if (!category) {
        return next(new Error("In-valid category", { cause: 404 }));
      } else {
        if (!req.body.name) {
          req.body.name = category.name;
        } else {
          const category = await findOne({
            model: categoryModel,
            condition: { name: req.body.name },
          });
          if (category) {
            return next(new Error("Name is dublicated", { cause: 400 }));
          }
        }
        req.body.slug = slugify(req.body.name);
        if (!req.file) {
          req.body.image = category.image;
          req.body.imagePublicId = category.imagePublicId;
        } else {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            {
              folder: `E-commerce/category/${user._id}`,
            }
          );
          req.body.image = secure_url;
          req.body.imagePublicId = public_id;
        }
        const updateCategory = await findOneAndUpdate({
          model: categoryModel,
          condition: { _id: category._id, createdBy: user._id },
          data: req.body,
          option: { new: false },
        });
        if (!updateCategory) {
          if (req.file) {
            await cloudinary.uploader.destroy(req.body.imagePublicId);
          }
          return next(new Error("Fail to update category", { cause: 400 }));
        } else {
          if (req.file) {
            await cloudinary.uploader.destroy(updateCategory.imagePublicId);
          }
          return res.status(200).json({ message: "Done", updateCategory });
        }
      }
    }
  }
});
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await findOne({
    model: categoryModel,
    condition: { _id: id },
    populate: [
      { path: "createdBy", select: "userName email" },
      { path: "SubCategory", select: "name image" },
      { path: "Product" },
    ],
  });
  if (!category) {
    return next(new Error("In-valid category", { cause: 404 }));
  } else {
    return res.status(200).json({ message: "Done", category });
  }
});
export const categories = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate({
    page: req.query.page,
    size: req.query.size,
  });
  const populate = [
    { path: "createdBy", select: "userName email" },
    { path: "SubCategory", select: "name image" },
    { path: "Product" },
  ];
  const categories = await find({
    model: categoryModel,
    skip,
    limit,
    populate,
  });
  return res.status(200).json({ message: "Done", categories });
});

import {
  create,
  findById,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../services/cloudinary.js";
import slugify from "slugify";
import { asyncHandler } from "../../../services/handleError.js";

export const addSubCategory = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      const { categoryId } = req.params;
      const { name } = req.body;
      const category = await findById({
        model: categoryModel,
        condition: categoryId,
      });
      if (!category) {
        return next(new Error("In-valid category", { cause: 404 }));
      } else {
        if (!name) {
          return next(new Error("Name is required", { cause: 400 }));
        } else {
          const subCategoryName = await findOne({
            model: subCategoryModel,
            condition: { name },
          });
          if (subCategoryName) {
            return next(new Error("Name is dublicated", { cause: 400 }));
          } else {
            if (!req.file) {
              return next(new Error("Image is required", { cause: 400 }));
            } else {
              const { secure_url, public_id } =
                await cloudinary.uploader.upload(req.file.path, {
                  folder: `E-commerce/subCategory/${user._id}`,
                });
              const subCategory = await create({
                model: subCategoryModel,
                data: {
                  name,
                  slug: slugify(name),
                  image: secure_url,
                  imagePublicId: public_id,
                  createdBy: user._id,
                  categoryId: category._id,
                },
              });
              return res.status(201).json({ message: "Done", subCategory });
            }
          }
        }
      }
    }
  }
});
export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { subCategoryId,categoryId } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      const subCategory = await findById({
        model: subCategoryModel,
        createdBy:user._id,
        condition: {subCategoryId,categoryId},
      });
      if (!subCategory) {
        return next(new Error("In-valid subCategory or category", { cause: 404 }));
      } else {
        if (req.body.name) {
          const subCategoryName = await findOne({
            model: subCategoryModel,
            condition: { name: req.body.name },
          });
          if (subCategoryName) {
            return next(new Error("Name is dublicated", { cause: 400 }));
          }
          req.body.slug = slugify(req.body.name);
        }
        if (!req.file) {
          req.body.image = subCategory.image;
          req.body.imagePublicId = subCategory.imagePublicId;
        } else {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            { folder: `E-commerce/subCategory/${user._id}` }
          );
          req.body.image = secure_url;
          req.body.imagePublicId = public_id;
        }
        const updateSubcategory = await findOneAndUpdate({
          model: subCategoryModel,
          condition: {
            _id: subCategory._id,
            createdBy: user._id,
          },
          data: req.body,
        });
        if (!updateSubcategory) {
          if (req.file) {
            await cloudinary.uploader.destroy(req.body.imagePublicId);
          }
          return next(new Error("In-valid subCategory ID", { cause: 404 }));
        } else {
          if (req.file) {
            await cloudinary.uploader.destroy(updateSubcategory.imagePublicId);
          }
          return res.status(200).json({ message: "Done", updateSubcategory });
        }
      }
    }
  }
});
export const getSubCategoryById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const populate = [
    {
      path: "createdBy",
      select: "userName email",
    },
    {
      path: "categoryId",
      select: "name image",
    },
    {
      path: "Product",
    },
  ];
  const subCategory = await findOne({
    model: subCategoryModel,
    condition: { _id: id },
    populate,
    select: "name image",
  });
  if (!subCategory) {
    return next(new Error("In-valid subCategory", { cause: 404 }));
  } else {
    return res.status(200).json({ message: "Done", subCategory });
  }
});

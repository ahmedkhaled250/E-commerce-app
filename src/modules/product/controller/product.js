import slugify from "slugify";
import {
  create,
  find,
  findById,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import subCategoryModel from "../../../../DB/model/SubCategory.model.js";
import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handleError.js";
import { paginate } from "../../../services/pagination.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const {
    name,
    totalAmount,
    price,
    categoryId,
    subCategoryId,
    brandId,
    discound,
  } = req.body;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      if (!req.files?.length) {
        return next(new Error("images are required", { cause: 400 }));
      } else {
        if (!name) {
          return next(new Error("name is required", { cause: 400 }));
        } else {
          const productName = await findOne({
            model: productModel,
            condition: { name },
          });
          if (productName) {
            return next(new Error("name is duplicate", { cause: 400 }));
          }
          req.body.slug = slugify(name);
        }
        req.body.stock = totalAmount;
        req.body.finalPrice = price - price * ((discound || 0) / 100);
        if (!categoryId) {
          return next(new Error("categoryId is required", { cause: 404 }));
        }
        if (!subCategoryId) {
          return next(new Error("subCategoryId is required", { cause: 404 }));
        }
        const subCategory = await findOne({
          model: subCategoryModel,
          condition: { _id: subCategoryId, categoryId },
        });
        if (!subCategory) {
          return next(
            new Error("In-valid category id or subCategory id", { cause: 404 })
          );
        }
        if (!brandId) {
          return next(new Error("brandId is required", { cause: 404 }));
        }
        const Brand = await findOne({
          model: brandModel,
          condition: { _id: brandId },
        });
        if (!Brand) {
          return next(new Error("In-valid brand id", { cause: 404 }));
        }
        let images = [];
        let imagesPublicIds = [];
        for (const file of req.files) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            { folder: `E-commerce/product/${user._id}` }
          );
          images.push(secure_url);
          imagesPublicIds.push(public_id);
        }
        req.body.images = images;
        req.body.imagesPublicIds = imagesPublicIds;
        req.body.createdBy = user._id;
        const product = await create({ model: productModel, data: req.body });
        return res.status(201).json({ message: "Done", product });
      }
    }
  }
});
export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    image,
    imagePublicId,
    name,
    price,
    discound,
    totalAmount,
    categoryId,
    subCategoryId,
    brandId,
  } = req.body;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      const product = await findOne({
        model: productModel,
        condition: { _id: id, createdBy: user._id },
      });
      if (!product) {
        return next(new Error("In-valid product", { cause: 404 }));
      } else {
        if (name) {
          const checkName = await findOne({
            model: productModel,
            condition: { name },
          });
          if (checkName) {
            return next(new Error("Duplicate product name", { cause: 409 }));
          } else {
            req.body.slug = slugify(name);
          }
        }
        if (totalAmount) {
          const calcStock = totalAmount - product.soldItem;
          calcStock >= 0 ? (req.body.stock = calcStock) : (req.body.stock = 0);
        }
        if (price && discound) {
          req.body.finalPrice = price - price * (discound / 100);
        } else if (price) {
          req.body.finalPrice = price - price * (product.discound / 100);
        } else if (discound) {
          req.body.finalPrice =
            product.price - product.price * (discound / 100);
        }
        if (!categoryId) {
          return next(new Error("categoryId is required", { cause: 404 }));
        }
        if (!subCategoryId) {
          return next(new Error("subCategoryId is required", { cause: 404 }));
        }
        const subCategory = await findOne({
          model: subCategoryModel,
          condition: { _id: subCategoryId, categoryId },
        });
        if (!subCategory) {
          return next(
            new Error("In-valid category or subCategory IDS", { cause: 404 })
          );
        }
        if (!brandId) {
          return next(new Error("brandId is required", { cause: 404 }));
        }
        const brand = await findOne({
          model: brandModel,
          condition: { _id: brandId },
        });
        if (!brand) {
          return next(new Error("In-valid brand ID", { cause: 404 }));
        }
        let imagId;
        const images = product.images;
        const imagesPublicIds = product.imagesPublicIds;
        if (req.file) {
          if (image && imagePublicId) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
              req.file.path,
              {
                folder: `E-commerce/product/${user._id}`,
              }
            );
            imagId = public_id;
            images.push(secure_url);
            imagesPublicIds.push(public_id);
            const indexImage = images.indexOf(image);
            const indexImagePublicId = imagesPublicIds.indexOf(imagePublicId);
            images.splice(indexImage, 1);
            imagesPublicIds.splice(indexImagePublicId, 1);
          } else if (image && !imagePublicId) {
            return next(new Error("In-valid imagePublicId", { cause: 400 }));
          } else if (!image && imagePublicId) {
            return next(new Error("In-valid image", { cause: 400 }));
          } else {
            if (images.length < 5) {
              const { secure_url, public_id } =
                await cloudinary.uploader.upload(req.file.path, {
                  folder: `E-commerce/product/${user._id}`,
                });
              imagId = public_id;
              images.push(secure_url);
              imagesPublicIds.push(public_id);
            } else {
              return next(
                new Error("The numbers of images big", { cause: 400 })
              );
            }
          }
        } else {
          if (image && imagePublicId) {
            const indexImage = images.indexOf(image);
            const indexImagePublicId = imagesPublicIds.indexOf(imagePublicId);
            if (indexImagePublicId == -1 && indexImage == -1) {
              return next(new Error("In-valid this image", { cause: 400 }));
            } else {
              images.splice(indexImage, 1);
              imagesPublicIds.splice(indexImagePublicId, 1);
            }
          } else if (image && !imagePublicId) {
            return next(new Error("In-valid imagePublicId", { cause: 400 }));
          } else if (!image && imagePublicId) {
            return next(new Error("In-valid image", { cause: 400 }));
          }
        }
        req.body.images = images;
        req.body.imagesPublicIds = imagesPublicIds;
        req.body.updatedBy = user._id;
        const updateProduct = await findOneAndUpdate({
          model: productModel,
          condition: {
            _id: product._id,
            createdBy: user._id,
          },
          data: req.body,
        });
        if (updateProduct) {
          if (image && imagePublicId) {
            await cloudinary.uploader.destroy(imagePublicId);
          }
          return res.status(200).json({ message: "Done", updateProduct });
        } else {
          if (req.file) {
            await cloudinary.uploader.destroy(imagId);
          }
          return next(new Error("Fail to update product", { cause: 400 }));
        }
      }
    }
  }
});
export const softDeleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your account is stopped", { cause: 400 }));
    } else {
      const product = await findOne({
        model: productModel,
        condition: { _id: id },
      });
      if (!product) {
        return next(new Error("In-valid product", { cause: 404 }));
      } else {
        if (
          user.role == "Admin" ||
          product.createdBy.toString() == user._id.toString()
        ) {
          let updateProduct;
          if (product.deleted) {
            updateProduct = await findOneAndUpdate({
              model: productModel,
              condition: { _id: product._id },
              data: { deleted: false, deletedBy: null },
              option: { new: true },
            });
          } else {
            updateProduct = await findOneAndUpdate({
              model: productModel,
              condition: { _id: product._id },
              data: { deleted: true, deletedBy: user._id },
              option: { new: true },
            });
          }
          return res.status(200).json({ message: "Done", updateProduct });
        } else {
          return next(new Error("Not auth user", { cause: 400 }));
        }
      }
    }
  }
});
export const products = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate({
    page: req.query.page,
    size: req.query.size,
  });
  const populate = [
    {
      path: "createdBy",
      select: "image userName email",
    },
    {
      path: "subCategoryId",
      populate: {
        path: "categoryId",
      },
    },
    {
      path: "brandId",
    },
    {
      path: "review",
    },
  ];
  const products = await find({
    model: productModel,
    condition: { deleted: false },
    skip,
    limit,
    populate,
  });
  return res.status(200).json({ message: "Done", products });
});
export const searsh = asyncHandler(async (req, res, next) => {
  const { name } = req.params;
  if (!name) {
    return next(new Error("name is required", { cause: 400 }));
  }
  const slug = slugify(name);
  const populate = [
    {
      path: "createdBy",
      select: "image userName email",
    },
    {
      path: "subCategoryId",
      populate: {
        path: "categoryId",
      },
    },
    {
      path: "brandId",
    },
    {
      path: "review",
    },
  ];
  const product = await findOne({
    model: productModel,
    condition: { slug },
    populate,
  });
  if (!product) {
    return next(new Error("In-valid product", { cause: 404 }));
  } else {
    return res.status(200).json({ message: "Done", product });
  }
});
// - Get products of specific subcategory
export const productsOfSpecificSubcategory = asyncHandler(
  async (req, res, next) => {
    const { subCategoryId } = req.params;
    const { skip, limit } = paginate({
      page: req.query.page,
      size: req.query.size,
    });
    const populate = [
      {
        path: "createdBy",
        select: "image userName email",
      },
      {
        path: "subCategoryId",
        populate: {
          path: "categoryId",
        },
      },
      {
        path: "brandId",
      },
      {
        path: "review",
      },
    ];
    const products = await find({
      model: productModel,
      condition: { subCategoryId },
      limit,
      skip,
      populate,
    });
    return res.status(200).json({ message: "Done", products });
  }
);
// - Get products of specific category
export const productsOfSpecificCategory = asyncHandler(
  async (req, res, next) => {
    const { categoryId } = req.params;
    const { skip, limit } = paginate({
      page: req.query.page,
      size: req.query.size,
    });
    const populate = [
      {
        path: "createdBy",
        select: "image userName email",
      },
      {
        path: "subCategoryId",
        populate: {
          path: "categoryId",
        },
      },
      {
        path: "brandId",
      },
      {
        path: "review",
      },
    ];
    const products = await find({
      model: productModel,
      condition: { categoryId },
      skip,
      limit,
      populate,
    });
    return res.status(200).json({ message: "Done", products });
  }
);

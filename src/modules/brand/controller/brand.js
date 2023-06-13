import slugify from "slugify";
import {
  create,
  find,
  findById,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import userModel from "../../../../DB/model/User.model.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/handleError.js";
import { paginate } from "../../../services/pagination.js";

export const createBrand = asyncHandler(async (req, res, next) => {
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
        const brand = await findOne({ model: brandModel, condition: { name } });
        if (brand) {
          return next(new Error("Name is dublicated", { cause: 400 }));
        } else {
          if (!req.file) {
            return next(new Error("logo is required", { cause: 400 }));
          } else {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
              req.file.path,
              {
                folder: `E-commerce/brand/${user._id}`,
              }
            );
            const newBrand = await create({
              model: brandModel,
              data: {
                name,
                slug: slugify(name),
                logo: secure_url,
                imagePublicId: public_id,
                createdBy: user._id,
              },
            });
            return res.status(201).json({ message: "Done", newBrand });
          }
        }
      }
    }
  }
});
export const updateBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your accouet is stopped", { cause: 400 }));
    } else {
      const brand = await findOne({
        model: brandModel,
        condition: {
          _id: id,
          createdBy: user._id,
        },
      });
      if (!brand) {
        return next(new Error("In-valid brand", { cause: 404 }));
      } else {
        if (req.body.name) {
          const brandName = await findOne({model:brandModel,condition:{name : req.body.name}})
          if(brandName){
            return next(new Error("Name is dublicated", { cause: 400 }));
          }
          req.body.slug = slugify(req.body.name);
        }
        if (!req.file) {
          req.body.logo = brand.logo;
          req.body.imagePublicId = brand.imagePublicId;
        } else {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            req.file.path,
            {
              folder: `E-commerce/brand/${user._id}`,
            }
          );
          req.body.logo = secure_url;
          req.body.imagePublicId = public_id;
        }
        const updateBrand = await findOneAndUpdate({
          model: brandModel,
          condition: { _id: brand._id, createdBy: user._id },
          data: req.body,
        });
        if (!updateBrand) {
          if (req.file) {
            await cloudinary.uploader.destroy(req.body.imagePublicId);
          }          
          return next(new Error("Fail to update brand", { cause: 400 }));
        } else {
          if (req.file) {
            await cloudinary.uploader.destroy(updateBrand.imagePublicId);
          }
          return res.status(200).json({ message: "Done", updateBrand });
        }
      }
    }
  }
});
export const brands = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate({
    page: req.query.page,
    size: req.query.size,
  });
  const brands = await find({
    model: brandModel,
    skip,
    limit,
    populate: [
      {
        path: "createdBy",
        select: "userName image email",
      },
    ],
  });
  return res.status(200).json({ message: "Done", brands });
});

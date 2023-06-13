import joi from "joi";
export const createProduct = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().min(2).max(200).required().messages({
        "any.required": "Name is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      description: joi.string().min(3).max(50),
      totalAmount: joi.number().required(),
      price: joi.number().min(1).required(),
      discound: joi.number(),
      colors: joi.array(),
      size: joi.array(),
      categoryId: joi.string().required(),
      subCategoryId: joi.string().required(),
      brandId: joi.string().required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const updateProduct = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().min(2).max(200).messages({
        "any.required": "Name is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      description: joi.string().min(3).max(50),
      totalAmount: joi.number(),
      price: joi.number().min(1),
      discound: joi.number(),
      colors: joi.array(),
      size: joi.array(),
      categoryId: joi.string(),
      subCategoryId: joi.string(),
      brandId: joi.string(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const products = {
  query: joi.object().required().keys({
    page: joi.number(),
    size: joi.number(),
  }),
};
export const searsh = {
  params: joi.object().required().keys({
    name: joi.string().required(),
  }),
};
export const productsOfSpecificSubcategory = {
  params: joi.object().required().keys({
    subCategoryId: joi.string().required(),
  }),
  query: joi.object().required().keys({
    page: joi.number(),
    size: joi.number(),
  }),
};
export const productsOfSpecificCategory = {
  params: joi.object().required().keys({
    categoryId: joi.string().required(),
  }),
  query: joi.object().required().keys({
    page: joi.number(),
    size: joi.number(),
  }),
};
export const softDeleteProduct = {
  params: joi.object().required().keys({
    id: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

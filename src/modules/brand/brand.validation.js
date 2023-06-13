import joi from "joi";
export const createBrand = {
  body: joi
    .object()
    .required()
    .keys({
        name: joi.string().min(2).max(20).required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getBrands = {
    query: joi
    .object()
    .required()
    .keys({
        page: joi.number(),
        size: joi.number(),
    }),
};
export const updateBrand = {
  params: joi
    .object()
    .required()
    .keys({
        id: joi.string().required(),
    }),
  body: joi
    .object()
    .required()
    .keys({
        name: joi.string().min(2).max(20),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

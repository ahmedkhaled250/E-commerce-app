import joi from "joi";

export const createCategory = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().min(2).max(20).required().messages({
        "any.required": "Name is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const updateCategory = {
    params: joi
    .object()
    .required()
    .keys({
      id: joi.string().required()
    }),
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().min(2).max(20).messages({
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getCategoryById = {
    params: joi
    .object()
    .required()
    .keys({
      id: joi.string().required()
    }),
};

import joi from "joi";
export const addReview = {
  body: joi
    .object()
    .required()
    .keys({
      message: joi.string().min(2).max(70).required().messages({
        "any.required": "Message is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      rating: joi.number().required(),
    }),
  params: joi.object().required().keys({
    productId: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const updateReview = {
  body: joi
    .object()
    .required()
    .keys({
      message: joi.string().min(2).max(70).messages({
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      rating: joi.number(),
    }),
  params: joi.object().required().keys({
    productId: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

export const getReviewProduct = {
  params: joi.object().required().keys({
    productId: joi.string().required(),
  }),
};
export const getReviewProductUser = {
  params: joi.object().required().keys({
    productId: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const deleteReview = {
  params: joi.object().required().keys({
    reviewId: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

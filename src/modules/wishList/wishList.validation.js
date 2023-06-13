import joi from "joi";
export const wishList = {
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

import joi from "joi";
const product = joi.object().required().keys({
  productId: joi.string().required(),
  quantity: joi.number().required(),
});
export const addToCart = {
  body: joi.object().required().keys({
    products: joi.array().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const deleteProductFromCart = {
  params: joi.object().required().keys({
    productId: joi.string().required(),
    cartId: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const removeProductsFromCart = {
  params: joi.object().required().keys({
    cartId: joi.string().required(),
  }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};

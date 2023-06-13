import joi from "joi";
export const createCopon = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().min(2).max(20).required(),
      amount: joi.number().min(1).max(100).required(),
      expireDate: joi.date().required(),
    }),
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const searshCopon = {
  headers: joi
  .object()
  .required()
  .keys({
    authorization: joi.string().required(),
  })
  .options({ allowUnknown: true }),
};
export const updateCopon = {
  body: joi
    .object()
    .required()
    .keys({
      name: joi.string().min(2).max(20),
      amount: joi.number().min(1).max(100),
      expireDate: joi.date(),
    }),
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
export const deleteCopon = {
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

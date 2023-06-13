import joi from "joi";

export const sendCode = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
    }),
};
export const forgetPssword = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      code: joi.string().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),

    }),
};
export const updateProfile = {
  body: joi
    .object()
    .required()
    .keys({
      email: joi.string().email().required().messages({
        "any.required": "Email is required",
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      code: joi.string().required(),
      password: joi
        .string()
        .pattern(
          new RegExp(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
          )
        )
        .required(),
      cPassword: joi.string().valid(joi.ref("password")).required(),

    }),
};
export const updatePassword = {
  body: joi
    .object()
    .required()
    .keys({
      userName: joi.string().min(2).max(20).messages({
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
      }),
      email: joi.string().email().messages({
        "string.empty": "not allowed to be empty",
        "string.base": "only string is allowed",
        "string.email": "please enter realy email",
      }),
      phone: joi.string().pattern(/^01[0125][0-9]{8}$/),
      address: joi.string(),
      DOB: joi.date(),
      gender:joi.string()
    }),
    headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const headers = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const blockAccount = {
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
export const ProfilePic = {
  headers: joi
    .object()
    .required()
    .keys({
      authorization: joi.string().required(),
    })
    .options({ allowUnknown: true }),
};
export const getUserById = {
  params: joi.object().required().keys({
    id: joi.string().required(),
  }),
};

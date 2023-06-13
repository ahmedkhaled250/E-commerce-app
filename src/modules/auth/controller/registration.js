import userModel from "../../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import { sendEmail } from "../../../services/email.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../../../services/handleError.js";
import {
  create,
  findById,
  findOne,
  findOneAndUpdate,
  updateOne,
} from "../../../../DB/DBMethods.js";
export const views = asyncHandler(async (req, res, next) => {
  return res.render("index.ejs");
});
export const failSocialLogin = asyncHandler(async (req, res, next) => {
  return next(new Error("Fail to social login", { cause: 400 }))
});
export const googleCallback = asyncHandler(async (req, res, next) => {
  const { provider, displayName, email_verified, email, id } = req.user;
  if (!email_verified) {
   return next(new Error("In-valid google account", { cause: 404 }))
  }
  const user = await findOne({
    model: userModel,
    condition: { email },
  });
  if (user) {
    if (!user.socialId) {
      await updateOne({
        model: userModel,
        condition: { _id: user._id },
        data: { socialId: id },
      });
    }
    await updateOne({
      model: userModel,
      condition: { _id: user._id },
      data: { active: true },
    });
    const token = jwt.sign(
      { id: user._id, isLoggedIn: true },
      process.env.tokenSignature,
      { expiresIn: 60 * 60 * 24 }
    );
    return res.status(200).json({ message: "Done", token, socialType: "login" });
  }
  // // signup
  const newUser = await create({
    model: userModel,
    data: {
      userName: displayName,
      email,
      confirmEmail: true,
      accountType: provider,
      socialId: id,
      active: true,
    },
  });
  const token = jwt.sign(
    { id: newUser._id, isLoggedIn: true },
    process.env.tokenSignature,
    { expiresIn: 60 * 60 * 24 }
  );
  return res.status(201).json({
    message: "Done",
    token,
    socialType: "register",
  });
});
export const facebookCallback = asyncHandler(async (req, res, next) => {
  const { provider, displayName, id } = req.user;
  const user = await findOne({
    model: userModel,
    condition: { socialId:id },
  });
  if (user) {
    await updateOne({
      model: userModel,
      condition: { _id: user._id },
      data: { active: true },
    });
    const token = jwt.sign(
      { id: user._id, isLoggedIn: true },
      process.env.tokenSignature,
      { expiresIn: 60 * 60 * 24 }
    );
    return res.status(200).json({ message: "Done", token, socialType: "login" });
  }
  // // signup
  const newUser = await create({
    model: userModel,
    data: {
      userName: displayName,
      confirmEmail: true,
      accountType: provider,
      socialId: id,
      active: true,
    },
  });
  const token = jwt.sign(
    { id: newUser._id, isLoggedIn: true },
    process.env.tokenSignature,
    { expiresIn: 60 * 60 * 24 }
  );
  return res.status(201).json({
    message: "Done",
    token,
    socialType: "register",
  });
});
export const signup = asyncHandler(async (req, res, next) => {
  const { userName, email, password, phone, role, DOB, address,gender } = req.body;
  const user = await findOne({
    model: userModel,
    condition: { email },
    select: "email",
  });
  if (user) {
   return next(new Error("Email Exist", { cause: 409 }));
  } else {
    const hash = bcrypt.hashSync(password, parseInt(process.env.SALTROUND));
    const newUser = new userModel({
      userName,
      email,
      gender,
      password: hash,
      phone,
      role,
      DOB,
      address,
    });
    const token = jwt.sign({ id: newUser._id }, process.env.emailToken, {
      expiresIn: "1h",
    });
    const rToken = jwt.sign({ id: newUser._id }, process.env.emailToken);
    const link1 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
    const link2 = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/refreshEmail/${rToken}`;
    const message = `
        <a href="${link1}">Confirm email</a>
        <br>
        <a href="${link2}">Request new Confirmation email</a>
        `;
    const info = await sendEmail(newUser.email, "Confirm-email", message);
    if (info.accepted.length) {
      const savedUser = await newUser.save();
     return res.status(201).json({ message: "Done", userId: savedUser._id });
    } else {
      return next(new Error("please enter correct email", { cause: 400 }));
    }
  }
});
export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded?.id) {
    return next(new Error("Invalid payload", { cause: 400 }));
  } else {
    await updateOne({
      model: userModel,
      condition: { _id: decoded.id, confirmEmail: false },
      data: { confirmEmail: true },
      select: "email",
    });
    return res.status(200).json({ message: "your email confirmed please login" });
  }
});
export const refreshEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.emailToken);
  if (!decoded?.id) {
    return next(new Error("Invalid payload", { cause: 400 }));
  } else {
    const user = await findById({ model: userModel, condition: decoded.id });
    if (user.confirmEmail) {
      return  next(new Error("Already confirmed", { cause: 400 }));
    } else {
      const token = jwt.sign({ id: user._id }, process.env.emailToken, {
        expiresIn: 60 * 5,
      });
      const link = `${req.protocol}://${req.headers.host}${process.env.BASEURL}/auth/confirmEmail/${token}`;
      const message = `
            <a href="${link}">Confirm email</a>
            `;
      await sendEmail(user.email, "confirm email", message);
      return  res.status(200).json({ message: "Go to confirm your email" });
    }
  }
});
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await findOne({ model: userModel, condition: { email } });
  if (!user) {
   return next(new Error("Email not Exist", { cause: 404 }));
  } else {
    if (user.blocked) {
      return next(new Error("Yor email is blocked", { cause: 400 }));
    } else {
      if (user.confirmEmail) {
        const compare = bcrypt.compareSync(password, user.password);
        if (!compare) {
          return next(new Error("In-valid password", { cause: 400 }));
        } else {
          await updateOne({
            model: userModel,
            condition: { _id: user._id },
            data: { active: true },
          });
          const token = jwt.sign(
            { id: user._id, isLoggedIn: true },
            process.env.tokenSignature,
            { expiresIn: 60 * 60 * 24 }
          );
          return   res.status(200).json({ message: "Done", token });
        }
      } else {
        return next(new Error("Please confirm your email", { cause: 400 }));
      }
    }
  }
});
export const logOut = asyncHandler(async (req, res, next) => {
  const user = await findOneAndUpdate({
    model: userModel,
    condition: { _id: req.user._id, active: true },
    data: { active: false },
    option: { new: true },
    select: "userName email",
  });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    return res.status(200).json({ message: "Done", user });
  }
});

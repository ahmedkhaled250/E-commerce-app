import userModel from "../../../../DB/model/User.model.js";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sendEmail } from "../../../services/email.js";
import { asyncHandler } from "../../../services/handleError.js";
import {
  find,
  findById,
  findByIdAndUpdate,
  findOne,
  updateOne,
} from "../../../../DB/DBMethods.js";
import cloudinary from "../../../services/cloudinary.js";
export const ProfilePic = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Yor email is stopped", { cause: 400 }));
    } else {
      if (!req.file) {
        return next(new Error("plz upload u image", { cause: 400 }));
      } else {
        const spilitEncoding = req.file.encoding.split("bit")[0];
        if (spilitEncoding > 10) {
          return next(new Error("file's Size is very big", { cause: 400 }));
        } else {
          let url;
          if (!user.image) {
            const { secure_url, public_id } = await cloudinary.uploader.upload(
              req.file.path,
              {
                folder: `E-commerce/user/profile/${req.user._id}`,
              }
            );
            url = { secure_url, public_id };
          } else {
            await cloudinary.uploader.destroy(user.imagePublicId);
            const { secure_url, public_id } = await cloudinary.uploader.upload(
              req.file.path,
              {
                folder: `E-commerce/user/profile/${req.user._id}`,
              }
            );
            url = { secure_url, public_id };
          }
          const userProfilePic = await findByIdAndUpdate({
            model: userModel,
            condition: user._id,
            data: { image: url.secure_url, imagePublicId: url.public_id },
            option: { new: true },
          });
          return res.status(200).json({ message: "Done", userProfilePic });
        }
      }
    }
  }
});
export const updateProfile = asyncHandler(async (req, res) => {
  const { userName, email, DOB, phone, address, gender } = req.body;
  const { user } = req;
  if (email) {
    if (user.email == email) {
      return next(
        new Error("Already this email is your email", { cause: 409 })
      );
    }
    const checkEmail = await userModel.findOne({ email });
    if (checkEmail) {
      return next(new Error("This email is already exist", { cause: 409 }));
    }
    await userModel.updateOne(
      { _id: user._id },
      {
        active: false,
        confirmEmail: false,
      }
    );
    const token = jwt.sign({ id: user._id }, process.env.EMAILTOKEN, {
      expiresIn: "1h",
    });
    const tokenRefresh = jwt.sign({ id: user._id }, process.env.EMAILTOKEN);
    const link1 = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`;
    const link2 = `${req.protocol}://${req.headers.host}/auth/refreshToken/${tokenRefresh}`;
    const message = `
    <a href='${link1}'>Click here confirm your email</a>
    <br>
    <a href='${link2}'>Click here to refresh token</a>
    `;
    const info = await sendEmail(user.email, "Confirm email", message);
    if (!info?.accepted?.length) {
      return next(new Error("Please, enter correct email", { cause: 400 }));
    }
  }
  const updateUser = await userModel.findByIdAndUpdate(
    user._id,
    {
      userName,
      email,
      DOB,
      phone,
      address,
      gender,
    },
    {
      new: true,
    }
  );
  if (!updateUser) {
    return next(new Error("Fail to update user", { cause: 400 }));
  }
  return res.status(200).json({ message: "Done", user: updateUser });
});
export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Yor email is stopped", { cause: 400 }));
    } else {
      if (!user.imagePublicId) {
        return next(new Error("Already not found image", { cause: 400 }));
      } else {
        await cloudinary.uploader.destroy(user.imagePublicId);
        const userProfilePic = await findByIdAndUpdate({
          model: userModel,
          condition: user._id,
          data: { image: null, imagePublicId: null },
          option: { new: true },
        });
        return res.status(200).json({ message: "Done", userProfilePic });
      }
    }
  }
});
export const sendCode = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await findOne({ model: userModel, condition: { email } });
  if (!user) {
    return next(new Error("In-valid user"));
  } else {
    if (user.blocked) {
      return next(new Error("Yor email is blocked", { cause: 400 }));
    } else {
      const code = nanoid();
      const info = await sendEmail(
        user.email,
        "Forget password",
        `<h1> code : ${code} </h1>`
      );
      if (info.accepted.length) {
        await updateOne({
          model: userModel,
          condition: { _id: user._id },
          data: { code },
        });
        return res.status(200).json({ message: "Done" });
      } else {
        return next(new Error("please enter correct email", { cause: 400 }));
      }
    }
  }
});
export const forgetPssword = asyncHandler(async (req, res, next) => {
  const { email, code, password } = req.body;
  if (!code) {
    return next(new Error("code is required", { cause: 400 }));
  } else {
    const user = await findOne({
      model: userModel,
      condition: { email },
      select: "email code",
    });
    if (!user) {
      return next(new Error("In-valid user", { cause: 400 }));
    } else {
      if (user.code === code) {
        const hashPassword = await bcrypt.hash(
          password,
          parseInt(process.env.SALTROUND)
        );
        const updateUser = await updateOne({
          model: userModel,
          condition: { _id: user._id },
          data: { password: hashPassword, code: null },
        });
        return res.status(200).json({ message: "Done", updateUser });
      } else {
        return next(new Error("In-valid code", { cause: 400 }));
      }
    }
  }
});
export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Yor email is stopped", { cause: 400 }));
    } else {
      const match = bcrypt.compareSync(oldPassword, user.password);
      if (!match) {
        return next(new Error("In-valid password", { cause: 400 }));
      } else {
        const hashPassword = bcrypt.hashSync(
          password,
          parseInt(process.env.SALTROUND)
        );
        const updatePasswordUser = await updateOne({
          model: userModel,
          condition: { _id: user._id },
          data: { password: hashPassword },
        });
        return res.status(200).json({ message: "Done", updatePasswordUser });
      }
    }
  }
});
export const softdelete = asyncHandler(async (req, res, next) => {
  const user = await findById({
    model: userModel,
    condition: req.user._id,
    select: "deleted",
  });
  if (user) {
    let account;
    if (user.deleted) {
      account = await findByIdAndUpdate({
        model: userModel,
        condition: user._id,
        data: { deleted: false, active: true },
        option: { new: true },
        select: "-password",
      });
    } else {
      account = await findByIdAndUpdate({
        model: userModel,
        condition: user._id,
        data: { deleted: true, active: false },
        option: { new: true },
        select: "-password",
      });
    }
    return res.status(200).json({ message: "Done", account });
  } else {
    return next(new Error("In-valid user", { cause: 404 }));
  }
});
export const blockAccount = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const userAdmin = await findOne({
    model: userModel,
    condition: { _id: req.user._id },
  });
  if (!userAdmin) {
    return next(new Error("In-valid user login", { cause: 404 }));
  } else {
    if (userAdmin.deleted) {
      return next(new Error("Your accont is stopped", { cause: 400 }));
    } else {
      if (userAdmin.role != "Admin") {
        return next(new Error("must be Admin", { cause: 400 }));
      } else {
        const user = await findById({ model: userModel, condition: id });
        if (!user) {
          return next(new Error("In-valid user id", { cause: 404 }));
        }
        if (user.role == "Admin") {
          return next(
            new Error("You can't do it because this user is Admin", {
              cause: 400,
            })
          );
        } else {
          if (!user.blocked) {
            await updateOne({
              model: userModel,
              condition: { _id: user._id },
              data: { blocked: true, active: false },
            });
          } else {
            await updateOne({
              model: userModel,
              condition: { _id: user._id },
              data: { blocked: false },
            });
          }
          return res.status(200).json({ message: "Done" });
        }
      }
    }
  }
});
export const getUserById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await findById({
    model: userModel,
    condition: id,
    select: "-password",
  });
  return res.status(200).json({ message: "Done", user });
});
export const users = asyncHandler(async (req, res, next) => {
  const users = await find({ model: userModel, select: "-password" });
  return res.status(200).json({ message: "Done", users });
});

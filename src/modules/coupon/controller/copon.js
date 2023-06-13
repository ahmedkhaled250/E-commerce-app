import {
  create,
  find,
  findById,
  findByIdAndUpdate,
  findOne,
  findOneAndUpdate,
} from "../../../../DB/DBMethods.js";
import coponModel from "../../../../DB/model/Copon.model.js";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../services/handleError.js";

export const createCopon = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your accouet is stopped", { cause: 400 }));
    } else {
      if (user.role != "Admin") {
        return next(new Error("The user must be admin", { cause: 400 }));
      } else {
        const coponName = await findOne({
          model: coponModel,
          condition: { name: req.body.name },
        });
        if (coponName) {
          return next(new Error("Name duplicated", { cause: 400 }));
        }
        req.body.createdBy = user._id;
        const copon = await create({ model: coponModel, data: req.body });
        if (copon) {
          return res.status(201).json({ message: "Done", copon });
        } else {
          return next(new Error("Fail to create copon", { cause: 400 }));
        }
      }
    }
  }
});
export const updateCopon = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your accouet is stopped", { cause: 400 }));
    } else {
      if (user.role != "Admin") {
        return next(new Error("The user must be admin", { cause: 400 }));
      } else {
        const { id } = req.params;
        const coponName = await findOne({
          model: coponModel,
          condition: { name: req.body.name },
        });
        if (coponName) {
          return next(new Error("Name duplicated", { cause: 400 }));
        }
        req.body.updatedBy = user._id;
        const copon = await findByIdAndUpdate({
          model: coponModel,
          condition: { _id: id },
          data: req.body,
          option: { new: true },
        });
        if (copon) {
          return res.status(200).json({ message: "Done", copon });
        } else {
          return next(new Error("In-valid copon id", { cause: 400 }));
        }
      }
    }
  }
});
export const deleteCopon = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your accouet is stopped", { cause: 400 }));
    } else {
      if (user.role != "Admin") {
        return next(new Error("The user must be admin", { cause: 400 }));
      } else {
        const copon = await findById({
          model: coponModel,
          condition: id,
        });
        if (!copon) {
          return next(new Error("In-valid copon", { cause: 404 }));
        } else {
          let updateCopon;
          if (copon.deleted) {
            updateCopon = await findByIdAndUpdate({
              model: coponModel,
              condition: copon._id,
              data: { deleted: false, deletedBy: null },
              option: { new: true },
            });
          } else {
            updateCopon = await findByIdAndUpdate({
              model: coponModel,
              condition: copon._id,
              data: { deleted: true, deletedBy: user._id },
              option: { new: true },
            });
          }
          if (updateCopon) {
            return res.status(200).json({ message: "Done", updateCopon });
          } else {
            return next(new Error("Fail to update copon", { cause: 404 }));
          }
        }
      }
    }
  }
});
export const searshCopon = asyncHandler(async (req, res, next) => {
  const copon = await findOne({
    model: coponModel,
    condition: { name: req.params.name, deleted: false },
    populate: { path: "createdBy", select: "userName image" },
  });
  if (copon) {
    return res.status(200).json({ message: "Done", copon });
  } else {
    return next(new Error("In-valid copon", { cause: 400 }));
  }
});
export const copons = asyncHandler(async (req, res, next) => {
  const user = await findById({ model: userModel, condition: req.user._id });
  if (!user) {
    return next(new Error("In-valid user", { cause: 404 }));
  } else {
    if (user.deleted) {
      return next(new Error("Your accouet is stopped", { cause: 400 }));
    } else {
      if (user.role != "Admin") {
        return next(new Error("The user must be admin", { cause: 400 }));
      } else {
        const copon = await find({
          model: coponModel,
          populate: [
            { path: "createdBy", select: "userName image" },
            { path: "deletedBy", select: "userName image" },
            { path: "updatedBy", select: "userName image" },
          ],
        });
        return res.status(201).json({ message: "Done", copon });
      }
    }
  }
});

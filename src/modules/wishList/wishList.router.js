import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as wishListController from './controller/wishList.js'
import * as validators from './wishList.validation.js'
import { endPoint } from "./wishList.endPoint.js";
const router = Router({mergeParams:true})
router.patch('/add',validation(validators.wishList),auth(endPoint.add),wishListController.add)
router.patch('/remove',validation(validators.wishList),auth(endPoint.remove),wishListController.remove)
export default router
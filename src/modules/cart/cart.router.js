import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { endPoint } from "./cart.endPoint.js";
import * as validators from './cart.validation.js'
import * as cartController from './controller/cart.js'
const router = Router({mergeParams:true})
router.post('/',validation(validators.addToCart),auth(endPoint.addCart),cartController.addToCart)
router.get('/',auth(endPoint.addCart),cartController.userCart)
router.patch('/:cartId',validation(validators.deleteProductFromCart),auth(endPoint.addCart),cartController.deleteProductFromCart)
router.put('/:cartId',validation(validators.removeProductsFromCart),auth(endPoint.addCart),cartController.removeProductsFromCart)
export default router
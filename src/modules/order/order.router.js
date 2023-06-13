import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as orderController from './controller/order.js'
import { endPoint } from "./order.endPoint.js";
const router = Router({ mergeParams: true })
router.post('/',auth(endPoint.createOrder),orderController.createOrder)
router.patch('/:orderId',auth(endPoint.createOrder),orderController.deleteFromOrder)
router.get('/',auth(endPoint.createOrder),orderController.userOrders)
export default router
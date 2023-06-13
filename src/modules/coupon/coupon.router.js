import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as validators from './coupon.validation.js'
import * as coponController from './controller/copon.js'
import { endPoint } from "./coupon.endPoint.js";
import { validation } from "../../middleware/validation.js";
const router = Router()
router.get('/:name',validation(validators.searshCopon),coponController.searshCopon)
router.get('/',validation(validators.searshCopon),auth(endPoint.createCopon),coponController.copons)
router.post('/',validation(validators.createCopon),auth(endPoint.createCopon),coponController.createCopon)
router.put('/:id',validation(validators.updateCopon),auth(endPoint.createCopon),coponController.updateCopon)
router.patch('/:id',validation(validators.deleteCopon),auth(endPoint.createCopon),coponController.deleteCopon)
export default router
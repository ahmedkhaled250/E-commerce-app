import { roles } from "../../middleware/auth.js";


export const endPoint = {
    createCopon :[roles.Admin],
    updateCopon :[roles.Admin]
}
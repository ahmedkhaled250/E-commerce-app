import { roles } from "../../middleware/auth.js";


export const endPoint = {
    addCart :[roles.Admin,roles.User,roles.Accounting],
}
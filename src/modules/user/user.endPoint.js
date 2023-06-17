import { roles } from "../../middleware/auth.js";

export const endPoint = {
    blockAccount :[roles.Admin],
    AllRoles :[roles.Admin,roles.Accounting,roles.User],
}
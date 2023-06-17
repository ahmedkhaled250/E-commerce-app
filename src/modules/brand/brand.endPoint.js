import { roles } from "../../middleware/auth.js";

export const endPoint = {
    createBrand :[roles.Admin,roles.Accounting,roles.User],
    updateBrand :[roles.Admin,roles.Accounting,roles.User]
}
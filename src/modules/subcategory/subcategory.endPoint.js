import { roles } from "../../middleware/auth.js";

export const endPoint = {
    addSubCategory :[roles.Admin,roles.Accounting],
    updateCategory :[roles.Admin,roles.Accounting]
}
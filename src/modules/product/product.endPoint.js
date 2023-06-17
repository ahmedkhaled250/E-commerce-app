import { roles } from "../../middleware/auth.js";

export const endPoint = {
    createProduct :[roles.Accounting,roles.Admin],
    updateProduct :[roles.Accounting,roles.Admin],
    softDeleteProduct :[roles.Admin,roles.Accounting]
}
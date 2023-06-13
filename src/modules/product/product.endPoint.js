import { roles } from "../../middleware/auth.js";

export const endPoint = {
    createProduct :[roles.Accouting,roles.Admin],
    updateProduct :[roles.Accouting,roles.Admin],
    softDeleteProduct :[roles.Admin,roles.Accouting]
}
import { roles } from "../../middleware/auth.js";

export const endPoint = {
    createBrand :[roles.Admin,roles.Accouting,roles.User],
    updateBrand :[roles.Admin,roles.Accouting,roles.User]
}
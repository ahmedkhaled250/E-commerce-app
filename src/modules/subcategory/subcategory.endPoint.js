import { roles } from "../../middleware/auth.js";

export const endPoint = {
    addSubCategory :[roles.Admin,roles.Accouting],
    updateCategory :[roles.Admin,roles.Accouting]
}
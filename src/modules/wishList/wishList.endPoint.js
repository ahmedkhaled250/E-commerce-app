import { roles } from "../../middleware/auth.js";

export const endPoint = {
    add : [roles.User,roles.Accouting,roles.Admin],
    remove : [roles.User,roles.Accouting,roles.Admin]
}
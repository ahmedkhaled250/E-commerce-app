import {roles} from "../../middleware/auth.js"
export const endPoint = {
    logOut :[roles.Admin,roles.User,roles.Accouting],
}